
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

    const requestBody = await req.json()
    const { taskId, operation, updates } = requestBody

    if (!taskId || !operation) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: taskId and operation' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    let result

    switch (operation) {
      case 'update':
        if (!updates) {
          return new Response(
            JSON.stringify({ error: 'Updates object required for update operation' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Validate allowed update fields
        const allowedFields = ['title', 'description', 'due_date', 'priority', 'importance']
        const filteredUpdates = Object.keys(updates)
          .filter(key => allowedFields.includes(key))
          .reduce((obj: any, key) => {
            obj[key] = updates[key]
            return obj
          }, {})

        // Ensure user can only update their own tasks
        const { data: updateData, error: updateError } = await supabaseClient
          .from('tasks')
          .update(filteredUpdates)
          .eq('id', taskId)
          .eq('user_id', user.id)
          .select()

        if (updateError) {
          console.error('Update error:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to update task' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        if (!updateData || updateData.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Task not found or access denied' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        result = { task: updateData[0] }
        break

      case 'delete':
        // Ensure user can only delete their own tasks
        const { data: deleteData, error: deleteError } = await supabaseClient
          .from('tasks')
          .delete()
          .eq('id', taskId)
          .eq('user_id', user.id)
          .select()

        if (deleteError) {
          console.error('Delete error:', deleteError)
          return new Response(
            JSON.stringify({ error: 'Failed to delete task' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        if (!deleteData || deleteData.length === 0) {
          return new Response(
            JSON.stringify({ error: 'Task not found or access denied' }),
            { 
              status: 404, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        result = { deleted: true, taskId }
        break

      case 'create':
        const { title, description, due_date, priority = 'medium', importance = 'medium' } = updates || {}

        if (!title) {
          return new Response(
            JSON.stringify({ error: 'Title is required for task creation' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        const { data: createData, error: createError } = await supabaseClient
          .from('tasks')
          .insert({
            user_id: user.id,
            title,
            description,
            due_date,
            priority,
            importance
          })
          .select()

        if (createError) {
          console.error('Create error:', createError)
          return new Response(
            JSON.stringify({ error: 'Failed to create task' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        result = { task: createData[0] }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation. Allowed: update, delete, create' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }

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
    console.error('Error in tasks-update:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
