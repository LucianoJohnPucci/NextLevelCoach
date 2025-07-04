
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 100; // requests per window
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

function logSecurityEvent(event: string, userId: string, details: any = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    userId,
    userAgent: details.userAgent || 'unknown',
    ip: details.ip || 'unknown',
    ...details
  }));
}

serve(async (req) => {
  const startTime = Date.now();
  let userId = 'anonymous';
  
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Only allow GET method
    if (req.method !== 'GET') {
      logSecurityEvent('METHOD_NOT_ALLOWED', userId, { method: req.method });
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      logSecurityEvent('MISSING_ENV_VARS', userId);
      throw new Error('Missing required environment variables');
    }

    // Create Supabase client with environment variables
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    // Verify user authentication - NEVER trust client-side identification
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', userId, {
        authError: authError?.message,
        userAgent: req.headers.get('User-Agent'),
      });
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    userId = user.id;

    // Check rate limit
    if (!checkRateLimit(userId)) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', userId, {
        userAgent: req.headers.get('User-Agent'),
      });
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log successful authentication
    logSecurityEvent('AUTHENTICATED_REQUEST', userId, {
      endpoint: 'tasks-retrieve',
      userAgent: req.headers.get('User-Agent'),
    });

    // Parse and validate query parameters
    const url = new URL(req.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100); // Cap at 100
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0);
    const priority = url.searchParams.get('priority');
    const importance = url.searchParams.get('importance');
    const sortBy = url.searchParams.get('sortBy') || 'created_at';
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? true : false;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['created_at', 'updated_at', 'title', 'due_date', 'priority', 'importance'];
    if (!allowedSortFields.includes(sortBy)) {
      logSecurityEvent('INVALID_SORT_FIELD', userId, { sortBy });
      return new Response(
        JSON.stringify({ error: 'Invalid sort field' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate priority and importance values
    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      logSecurityEvent('INVALID_PRIORITY_VALUE', userId, { priority });
      return new Response(
        JSON.stringify({ error: 'Invalid priority value' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (importance && !validPriorities.includes(importance)) {
      logSecurityEvent('INVALID_IMPORTANCE_VALUE', userId, { importance });
      return new Response(
        JSON.stringify({ error: 'Invalid importance value' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Build query - ALWAYS filter by authenticated user's ID
    let query = supabaseClient
      .from('tasks')
      .select('*')
      .eq('user_id', user.id) // CRITICAL: Always filter by authenticated user
      .range(offset, offset + limit - 1)
      .order(sortBy, { ascending: sortOrder })

    // Apply additional filters
    if (priority) {
      query = query.eq('priority', priority)
    }

    if (importance) {
      query = query.eq('importance', importance)
    }

    const { data: tasks, error: tasksError } = await query

    if (tasksError) {
      logSecurityEvent('DATABASE_ERROR', userId, { 
        error: tasksError.message,
        operation: 'select_tasks' 
      });
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve tasks' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get total count for pagination
    const { count: totalCount } = await supabaseClient
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id) // CRITICAL: Always filter by authenticated user

    // Log successful operation
    logSecurityEvent('SUCCESSFUL_OPERATION', userId, {
      operation: 'tasks-retrieve',
      taskCount: tasks?.length || 0,
      duration: Date.now() - startTime
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        tasks: tasks || [],
        pagination: {
          total: totalCount || 0,
          limit,
          offset,
          hasMore: (offset + limit) < (totalCount || 0)
        },
        userId: user.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    logSecurityEvent('SYSTEM_ERROR', userId, { 
      error: error.message,
      stack: error.stack,
      duration: Date.now() - startTime
    });
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
