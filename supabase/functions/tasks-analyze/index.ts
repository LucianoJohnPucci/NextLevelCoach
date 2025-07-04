
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 30; // Lower limit for analysis operations
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

    const { tasks, analysisType = 'priority' } = requestBody;

    // Validate analysis type
    const validAnalysisTypes = ['priority', 'workload', 'timeline'];
    if (!validAnalysisTypes.includes(analysisType)) {
      logSecurityEvent('INVALID_ANALYSIS_TYPE', userId, { analysisType });
      return new Response(
        JSON.stringify({ error: 'Invalid analysis type. Allowed: priority, workload, timeline' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Log the analysis attempt
    logSecurityEvent('ANALYSIS_ATTEMPT', userId, {
      analysisType,
      hasProvidedTasks: !!tasks,
      endpoint: 'tasks-analyze'
    });

    // Fetch user's tasks if not provided - ALWAYS filter by authenticated user
    let tasksToAnalyze = tasks;
    if (!tasksToAnalyze) {
      const { data: userTasks, error: tasksError } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq('user_id', user.id) // CRITICAL: Always filter by authenticated user
        .order('created_at', { ascending: false })

      if (tasksError) {
        logSecurityEvent('DATABASE_FETCH_ERROR', userId, { 
          error: tasksError.message,
          operation: 'fetch_tasks_for_analysis' 
        });
        return new Response(
          JSON.stringify({ error: 'Failed to fetch tasks' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      tasksToAnalyze = userTasks;
    } else {
      // If tasks are provided, validate they belong to the authenticated user
      // This is an additional security check
      const taskIds = tasksToAnalyze.map((task: any) => task.id).filter(Boolean);
      if (taskIds.length > 0) {
        const { data: verificationTasks, error: verificationError } = await supabaseClient
          .from('tasks')
          .select('id')
          .eq('user_id', user.id)
          .in('id', taskIds);

        if (verificationError || verificationTasks?.length !== taskIds.length) {
          logSecurityEvent('UNAUTHORIZED_TASK_ACCESS', userId, { 
            providedTaskIds: taskIds,
            verifiedTaskIds: verificationTasks?.map(t => t.id) || []
          });
          return new Response(
            JSON.stringify({ error: 'Unauthorized access to task data' }),
            { 
              status: 403, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }
    }

    // Perform task analysis based on type
    let analysis = {};
    
    switch (analysisType) {
      case 'priority':
        analysis = analyzePriority(tasksToAnalyze);
        break;
      case 'workload':
        analysis = analyzeWorkload(tasksToAnalyze);
        break;
      case 'timeline':
        analysis = analyzeTimeline(tasksToAnalyze);
        break;
    }

    // Log successful operation
    logSecurityEvent('SUCCESSFUL_OPERATION', userId, {
      operation: 'tasks-analyze',
      analysisType,
      taskCount: tasksToAnalyze?.length || 0,
      duration: Date.now() - startTime
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis,
        taskCount: tasksToAnalyze?.length || 0,
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

// Helper functions for task analysis with input validation
function analyzePriority(tasks: any[]) {
  // Validate tasks array
  if (!Array.isArray(tasks)) {
    return { error: 'Invalid tasks data' };
  }

  const priorityGroups = {
    high: tasks.filter(task => task?.priority === 'high').length,
    medium: tasks.filter(task => task?.priority === 'medium').length,
    low: tasks.filter(task => task?.priority === 'low').length
  };

  const importanceGroups = {
    high: tasks.filter(task => task?.importance === 'high').length,
    medium: tasks.filter(task => task?.importance === 'medium').length,
    low: tasks.filter(task => task?.importance === 'low').length
  };

  const urgentImportant = tasks.filter(task => 
    task?.priority === 'high' && task?.importance === 'high'
  );

  return {
    priorityDistribution: priorityGroups,
    importanceDistribution: importanceGroups,
    urgentImportantTasks: urgentImportant,
    recommendations: generatePriorityRecommendations(priorityGroups, importanceGroups)
  };
}

function analyzeWorkload(tasks: any[]) {
  if (!Array.isArray(tasks)) {
    return { error: 'Invalid tasks data' };
  }

  const totalTasks = tasks.length;
  const tasksWithDueDates = tasks.filter(task => task?.due_date).length;
  const now = new Date();
  const overdueTasks = tasks.filter(task => 
    task?.due_date && new Date(task.due_date) < now
  ).length;

  return {
    totalTasks,
    tasksWithDueDates,
    overdueTasks,
    workloadStatus: totalTasks > 20 ? 'heavy' : totalTasks > 10 ? 'moderate' : 'light'
  };
}

function analyzeTimeline(tasks: any[]) {
  if (!Array.isArray(tasks)) {
    return { error: 'Invalid tasks data' };
  }

  const today = new Date();
  const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const dueToday = tasks.filter(task => {
    if (!task?.due_date) return false;
    const taskDate = new Date(task.due_date);
    return taskDate.toDateString() === today.toDateString();
  }).length;

  const dueThisWeek = tasks.filter(task => {
    if (!task?.due_date) return false;
    const taskDate = new Date(task.due_date);
    return taskDate <= thisWeek && taskDate >= today;
  }).length;

  const dueThisMonth = tasks.filter(task => {
    if (!task?.due_date) return false;
    const taskDate = new Date(task.due_date);
    return taskDate <= thisMonth && taskDate >= today;
  }).length;

  return {
    dueToday,
    dueThisWeek,
    dueThisMonth,
    timeline: 'analyzed'
  };
}

function generatePriorityRecommendations(priority: any, importance: any) {
  const recommendations = [];
  
  if (priority.high > priority.medium + priority.low) {
    recommendations.push("Consider if all high-priority tasks are truly urgent");
  }
  
  if (importance.high < importance.medium) {
    recommendations.push("Focus on identifying truly important tasks");
  }
  
  return recommendations;
}
