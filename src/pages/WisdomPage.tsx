
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare, Sparkles, User, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Stoic wisdom quotes for the side panel
const stoicWisdom = [
  {
    quote: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius"
  },
  {
    quote: "You have power over your mind – not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius"
  },
  {
    quote: "He who fears death will never do anything worthy of a man who is alive.",
    author: "Seneca"
  },
  {
    quote: "The chief task in life is simply this: to identify and separate matters so that I can say clearly to myself which are externals not under my control, and which have to do with the choices I actually control.",
    author: "Epictetus"
  },
  {
    quote: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus"
  }
];

const WisdomPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Welcome to Wisdom. Ask me anything about stoicism, philosophy, or how to apply ancient wisdom to modern challenges.",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('wisdom-chat', {
        body: { message: input.trim() }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Simplified response handling - directly use the content if available
      const content = data?.content || "I couldn't generate wisdom at this moment.";
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: content,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Log the successful response for debugging
      console.log("Successful wisdom response:", content);
      
    } catch (error) {
      console.error("Error calling wisdom-chat function:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      
      // Add a fallback response with error details
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: `I apologize, but I'm unable to provide wisdom at the moment. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Wisdom</h1>
        <p className="text-muted-foreground">
          Seek guidance from stoic philosophy and timeless wisdom.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Wisdom Chat
            </CardTitle>
            <CardDescription>
              Ask questions about philosophy, stoicism, or life's challenges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex max-w-[80%] items-start gap-3 rounded-lg p-4 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        message.role === "user"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}>
                        {message.role === "user" ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Sparkles className="h-5 w-5" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex max-w-[80%] items-center gap-3 rounded-lg bg-secondary p-4 text-secondary-foreground">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      </div>
                      <p className="text-sm">Consulting ancient wisdom...</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center gap-2">
              <Textarea
                placeholder="Ask for wisdom..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 min-h-[60px] max-h-[120px]"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Wisdom</CardTitle>
            <CardDescription>
              Stoic quotes to inspire your day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stoicWisdom.map((wisdom, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-lg bg-primary/5 p-4"
                >
                  <p className="mb-2 text-sm italic">{wisdom.quote}</p>
                  <p className="text-right text-xs font-medium">— {wisdom.author}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WisdomPage;
