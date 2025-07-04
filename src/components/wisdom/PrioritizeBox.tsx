
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Target, Send, RefreshCw, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/wisdom";
import MessageItem from "./MessageItem";
import { addWisdomToNotes } from "@/utils/wisdomUtils";
import { useAuth } from "@/hooks/useAuth";
import { usePrioritizeTasks } from "@/hooks/usePrioritizeTasks";
import TaskQuickAdd from "./TaskQuickAdd";

const PrioritizeBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "I'm here to help you prioritize your goals and break down big tasks. I can see your existing tasks and help you create new ones. Tell me what you're working on, and we'll strategize together.",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { tasks, loading: tasksLoading, addTask } = usePrioritizeTasks();
  
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
      // Prepare context with current tasks
      const tasksContext = tasks.length > 0 ? 
        `\n\nCurrent user tasks:\n${tasks.map(task => 
          `- ${task.title} (Priority: ${task.priority}, Importance: ${task.importance}${task.due_date ? `, Due: ${task.due_date}` : ''})`
        ).join('\n')}` : '';
      
      const contextualMessage = input.trim() + tasksContext;
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('wisdom-chat', {
        body: { 
          message: contextualMessage,
          mode: "prioritize"
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling wisdom-chat function:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      
      // Add a fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: "I apologize, but I'm unable to help with prioritization at the moment. Please try again later.",
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

  const addMessageToNotes = async (message: Message) => {
    if (message.role === "assistant") {
      await addWisdomToNotes(message, user, toast);
    }
  };
  
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <CardTitle>Chat AI Prioritize</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Quick Add Task
          </Button>
        </div>
        <CardDescription>
          Let me break down big goals or strategize with you. I can see your {tasks.length} existing tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showTaskForm && (
          <div className="mb-4">
            <TaskQuickAdd 
              onTaskAdded={addTask}
              onClose={() => setShowTaskForm(false)}
            />
          </div>
        )}
        <ScrollArea className="h-[300px] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message} 
                onAddToNotes={addMessageToNotes} 
              />
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
                  <p className="text-sm">Strategizing priorities...</p>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center gap-2">
          <Textarea
            placeholder="Enter a goal to prioritize or break down..."
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
  );
};

export default PrioritizeBox;
