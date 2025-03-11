
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
    const { message } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://lovable.dev", // replace with your site URL
        "X-Title": "Wisdom Chat"
      },
      body: JSON.stringify({
        model: "qwen/qwq-32b:free",
        messages: [
          {
            role: "system",
            content: "You are a concise philosophical and stoic guide. Provide wisdom in exactly 1-2 brief sentences, followed by ONE intriguing question that provokes deeper thought. Your responses should reference stoic principles or philosophical concepts, but be extremely brief and accessible. Never use more than 2 sentences for the wisdom portion."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data));

    // Simplified response handling - just return whatever we get
    return new Response(JSON.stringify({
      content: data.choices?.[0]?.message?.content || "Could not generate wisdom at this time."
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in wisdom-chat function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
