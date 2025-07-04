
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 50; // Lower limit for mutations
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

function validateTaskData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const validPriorities = ['low', 'medium', 'high'];
  const validImportance = ['low', 'medium', 'high'];

  if (data.priority && !validPriorities.includes(data.priority)) {
    errors.push('Invalid priority value');
  }

  if (data.importance && !validImportance.includes(data.importance)) {
    errors.push('Invalid importance value');
  }

  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim().length === 0)) {
    errors.push('Title must be a non-empty string');
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('Description must be a string');
  }

  if (data.due_date !== undefined && data.due_date !== null) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.due_date)) {
      errors.push('Due date must be in YYYY-MM-DD format');
    }
  }

  return { isValid: errors.length === 0, errors };
}

serve(async (req) => {
  const startTime = Date.now();
  let userId = 'anonymous';

  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Only allow POST method
    if (req.method !== 'POST') {
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

    // Create Supabase client
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

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      logSecurityEvent('INVALID_JSON', userId, { error: error.message });
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { taskId, operation, updates } = requestBody;

    if (!operation || !['update', 'delete', 'create'].includes(operation)) {
      logSecurityEvent('INVALID_OPERATION', userId, { operation });
      return new Response(
        JSON.stringify({ error: 'Invalid operation. Allowed: update, delete, create' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log the operation attempt
    logSecurityEvent('OPERATION_ATTEMPT', userId, {
      operation,
      taskId: taskId || 'new',
      endpoint: 'tasks-update'
    });

    let result;

    switch (operation) {
      case 'update':
        if (!taskId || !updates) {
          logSecurityEvent('MISSING_REQUIRED_FIELDS', userId, { operation, hasTaskId: !!taskId, hasUpdates: !!updates });
          return new Response(
            JSON.stringify({ error: 'TaskId and updates required for update operation' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Validate update data
        const updateValidation = validateTaskData(updates);
        if (!updateValidation.isValid) {
          logSecurityEvent('INVALID_UPDATE_DATA', userId, { errors: updateValidation.errors });
          return new Response(
            JSON.stringify({ error: 'Invalid update data', details: updateValidation.errors }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Validate allowed update fields to prevent unauthorized field updates
        const allowedFields = ['title', 'description', 'due_date', 'priority', 'importance'];
        const filteredUpdates = Object.keys(updates)
          .filter(key => allowedFields.includes(key))
          .reduce((obj: any, key) => {
            obj[key] = updates[key];
            return obj;
          }, {});

        // CRITICAL: Always filter by authenticated user's ID - NEVER trust client
        const { data: updateData, error: updateError } = await supabaseClient
          .from('tasks')
          .update(filteredUpdates)
          .eq('id', taskId)
          .eq('user_id', user.id) // CRITICAL: Always filter by authenticated user
          .select()

        if (updateError) {
          logSecurityEvent('DATABASE_UPDATE_ERROR', userId, { 
            error: updateError.message,
            taskId 
          });
          return new Response(
            JSON.stringify({ error: 'Failed to update task' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        if (!updateData || updateData.length === 0) {
          logSecurityEvent('TASK_NOT_FOUND_OR_ACCESS_DENIED', userId, { taskId, operation: 'update' });
          return new Response(
            JSON.stringify({ error: 'Task not found or access denied' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        result = { task: updateData[0] };
        break;

      case 'delete':
        if (!taskId) {
          logSecurityEvent('MISSING_TASK_ID', userId, { operation });
          return new Response(
            JSON.stringify({ error: 'TaskId required for delete operation' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // CRITICAL: Always filter by authenticated user's ID
        const { data: deleteData, error: deleteError } = await supabaseClient
          .from('tasks')
          .delete()
          .eq('id', taskId)
          .eq('user_id', user.id) // CRITICAL: Always filter by authenticated user
          .select()

        if (deleteError) {
          logSecurityEvent('DATABASE_DELETE_ERROR', userId, { 
            error: deleteError.message,
            taskId 
          });
          return new Response(
            JSON.stringify({ error: 'Failed to delete task' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        if (!deleteData || deleteData.length === 0) {
          logSecurityEvent('TASK_NOT_FOUND_OR_ACCESS_DENIED', userId, { taskId, operation: 'delete' });
          return new Response(
            JSON.stringify({ error: 'Task not found or access denied' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        result = { deleted: true, taskId };
        break;

      case 'create':
        const { title, description, due_date, priority = 'medium', importance = 'medium' } = updates || {};

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
          logSecurityEvent('INVALID_CREATE_DATA', userId, { error: 'Missing or invalid title' });
          return new Response(
            JSON.stringify({ error: 'Title is required and must be a non-empty string' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Validate create data
        const createValidation = validateTaskData({ title, description, due_date, priority, importance });
        if (!createValidation.isValid) {
          logSecurityEvent('INVALID_CREATE_DATA', userId, { errors: createValidation.errors });
          return new Response(
            JSON.stringify({ error: 'Invalid task data', details: createValidation.errors }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // CRITICAL: Always set user_id to authenticated user - NEVER trust client
        const { data: createData, error: createError } = await supabaseClient
          .from('tasks')
          .insert({
            user_id: user.id, // CRITICAL: Always set to authenticated user
            title: title.trim(),
            description,
            due_date,
            priority,
            importance
          })
          .select()

        if (createError) {
          logSecurityEvent('DATABASE_CREATE_ERROR', userId, { 
            error: createError.message
          });
          return new Response(
            JSON.stringify({ error: 'Failed to create task' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        result = { task: createData[0] };
        break;
    }

    // Log successful operation
    logSecurityEvent('SUCCESSFUL_OPERATION', userId, {
      operation,
      taskId: taskId || result?.task?.id,
      duration: Date.now() - startTime
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        operation,
        ...result,
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
