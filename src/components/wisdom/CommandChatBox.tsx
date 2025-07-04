import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, Send, RefreshCw, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ChatCommandService } from "@/services/chatCommandService";
import { useAuth } from "@/hooks/useAuth";

interface CommandMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const CommandChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CommandMessage[]>([
    {
      id: "welcome",
      content: "🤖 **Task Command Assistant Ready!**\n\nI can help you manage your tasks with natural language commands:\n\n• \"Show me my high priority tasks\"\n• \"Update task ABC123 to high importance\"\n• \"What tasks are due this week?\"\n• \"Analyze my task completion patterns\"\n• \"Create a new task 'Buy groceries' with high priority\"\n\nWhat would you like me to help you with?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const quickActions = [
    {
      label: "High Priority Tasks",
      command: "Show me my high priority tasks",
      icon: "⚡"
    },
    {
      label: "Due This Week",
      command: "What tasks are due this week?",
      icon: "📅"
    },
    {
      label: "Task Analysis",
      command: "Analyze my task completion patterns",
      icon: "📊"
    },
    {
      label: "Create High Priority Task",
      command: "Create a new task with high priority called ",
      icon: "➕"
    }
  ];
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleQuickAction = (command: string) => {
    setInput(command);
  };
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to use task commands.",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage: CommandMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const response = await ChatCommandService.executeCommand(input.trim());
      
      const assistantMessage: CommandMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing command:", error);
      
      const errorMessage: CommandMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your command. Please try again.",
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Task Command Interface
        </CardTitle>
        <CardDescription>
          Use natural language to manage your tasks efficiently
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Quick Action Buttons */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Zap className="h-4 w-4" />
            Quick Actions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.command)}
                className="justify-start text-left h-auto py-2 px-3"
                disabled={isLoading}
              >
                <span className="mr-2">{action.icon}</span>
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

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
                <div className={`flex max-w-[80%] flex-col items-start gap-3 rounded-lg p-4 ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  <div className="flex items-start gap-3 w-full">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      message.role === "user"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}>
                      {message.role === "user" ? "👤" : "🤖"}
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
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
                  <p className="text-sm">Processing your command...</p>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center gap-2">
          <Textarea
            placeholder="Try: 'Show me my high priority tasks' or 'Create a new task'"
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

export default CommandChatBox;
