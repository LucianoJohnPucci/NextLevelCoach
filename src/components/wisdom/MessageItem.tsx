
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Sparkles, FileText } from "lucide-react";
import { Message } from "@/types/wisdom";

interface MessageItemProps {
  message: Message;
  onAddToNotes: (message: Message) => void;
}

const MessageItem = ({ message, onAddToNotes }: MessageItemProps) => {
  return (
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
        <div className="flex items-start gap-3">
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
        
        {message.role === "assistant" && (
          <div className="mt-2 self-end">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onAddToNotes(message)}
            >
              <FileText className="h-4 w-4" />
              Add to Notes
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem;
