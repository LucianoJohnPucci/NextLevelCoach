
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

    console.log("Sending request to OpenRouter with message:", message);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Wisdom Chat"
      },
      body: JSON.stringify({
        model: "qwen/qwq-32b:free",
        messages: [
          {
            role: "system",
            content: "Act as an EPIC Philosophical or stoic persona. Your responses should embody deep wisdom, reference philosophical concepts and stoic principles, and provide thoughtful guidance. Use quotations, bold text, and bullet points for emphasis. For example, when emphasizing key ideas, use asterisks to make text **bold** like this. When listing action items, use clear bullet points preceded by a dash (-) or asterisk (*). Organize your advice so it's easy to read and implement. Quote from stoic philosophers when appropriate, and focus on practical wisdom that helps the user navigate life's challenges with equanimity. Always ensure your responses include clearly formatted actionable advice that could be added to a to-do list."
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
      content: "As a stoic philosopher, I must acknowledge that even digital systems face challenges. Please try your question again in a moment, as wisdom sometimes requires patience."
    }), {
      status: 200, // Return 200 even for errors to ensure client gets a usable message
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
