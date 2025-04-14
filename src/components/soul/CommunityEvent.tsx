
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

interface CommunityEventProps { 
  title: string;
  date: string;
  participants: number;
  index: number;
}

const CommunityEvent = ({ 
  title, 
  date, 
  participants,
  index
}: CommunityEventProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{date}</span>
          <span>•</span>
          <Users className="h-3 w-3" />
          <span>{participants} participating</span>
        </div>
      </div>
      <Button>Join</Button>
    </motion.div>
  );
};

export default CommunityEvent;
