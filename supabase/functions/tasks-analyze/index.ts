
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Only allow POST method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { tasks, analysisType = 'priority' } = await req.json()

    // Fetch user's tasks if not provided
    let tasksToAnalyze = tasks
    if (!tasksToAnalyze) {
      const { data: userTasks, error: tasksError } = await supabaseClient
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (tasksError) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch tasks' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      tasksToAnalyze = userTasks
    }

    // Perform task analysis based on type
    let analysis = {}
    
    switch (analysisType) {
      case 'priority':
        analysis = analyzePriority(tasksToAnalyze)
        break
      case 'workload':
        analysis = analyzeWorkload(tasksToAnalyze)
        break
      case 'timeline':
        analysis = analyzeTimeline(tasksToAnalyze)
        break
      default:
        analysis = analyzePriority(tasksToAnalyze)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis,
        taskCount: tasksToAnalyze.length,
        userId: user.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in tasks-analyze:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Helper functions for task analysis
function analyzePriority(tasks: any[]) {
  const priorityGroups = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  }

  const importanceGroups = {
    high: tasks.filter(task => task.importance === 'high').length,
    medium: tasks.filter(task => task.importance === 'medium').length,
    low: tasks.filter(task => task.importance === 'low').length
  }

  const urgentImportant = tasks.filter(task => 
    task.priority === 'high' && task.importance === 'high'
  )

  return {
    priorityDistribution: priorityGroups,
    importanceDistribution: importanceGroups,
    urgentImportantTasks: urgentImportant,
    recommendations: generatePriorityRecommendations(priorityGroups, importanceGroups)
  }
}

function analyzeWorkload(tasks: any[]) {
  const totalTasks = tasks.length
  const tasksWithDueDates = tasks.filter(task => task.due_date).length
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date()
  ).length

  return {
    totalTasks,
    tasksWithDueDates,
    overdueTasks,
    workloadStatus: totalTasks > 20 ? 'heavy' : totalTasks > 10 ? 'moderate' : 'light'
  }
}

function analyzeTimeline(tasks: any[]) {
  const today = new Date()
  const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const dueToday = tasks.filter(task => 
    task.due_date && new Date(task.due_date).toDateString() === today.toDateString()
  ).length

  const dueThisWeek = tasks.filter(task => 
    task.due_date && new Date(task.due_date) <= thisWeek && new Date(task.due_date) >= today
  ).length

  const dueThisMonth = tasks.filter(task => 
    task.due_date && new Date(task.due_date) <= thisMonth && new Date(task.due_date) >= today
  ).length

  return {
    dueToday,
    dueThisWeek,
    dueThisMonth,
    timeline: 'analyzed'
  }
}

function generatePriorityRecommendations(priority: any, importance: any) {
  const recommendations = []
  
  if (priority.high > priority.medium + priority.low) {
    recommendations.push("Consider if all high-priority tasks are truly urgent")
  }
  
  if (importance.high < importance.medium) {
    recommendations.push("Focus on identifying truly important tasks")
  }
  
  return recommendations
}
