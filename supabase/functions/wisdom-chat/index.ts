
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, mode = "wisdom" } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log(`Sending request to OpenRouter with message in ${mode} mode:`, message);

    // Choose the system message based on the mode
    let systemMessage = "";
    
    if (mode === "prioritize") {
      systemMessage = "You are an expert productivity coach and strategist. Your goal is to help the user break down large goals into manageable tasks, prioritize effectively, and develop actionable strategies. Focus on practical, step-by-step approaches that help them make progress. Use frameworks like SMART goals, Eisenhower Matrix, or other prioritization techniques when appropriate. Provide specific, actionable advice rather than general principles.";
    } else {
      systemMessage = "Act as an EPIC Philosophical or stoic persona. Your responses should embody deep wisdom, reference philosophical concepts and stoic principles, and provide thoughtful guidance. Use quotes from stoic philosophers when appropriate, and focus on practical wisdom that helps the user navigate life's challenges with equanimity. Always ensure your responses include actionable advice that could be added to a to-do list.";
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": mode === "prioritize" ? "Priority Chat" : "Wisdom Chat"
      },
      body: JSON.stringify({
        model: "qwen/qwq-32b:free",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data));

    // Check if the response has the expected structure
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Invalid response format from OpenRouter:", JSON.stringify(data));
      throw new Error('Invalid response format from the API');
    }

    const content = data.choices[0].message.content;
    console.log("Extracted content:", content);

    return new Response(JSON.stringify({
      content: content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in wisdom-chat function:", error);
    
    return new Response(JSON.stringify({ 
      content: "I apologize, but I'm unable to provide assistance at the moment. Please try your question again in a moment."
    }), {
      status: 200, // Return 200 even for errors to ensure client gets a usable message
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
