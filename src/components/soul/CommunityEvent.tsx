
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, Tag } from "lucide-react";

interface CommunityEventProps { 
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  ticketCost: number | null;
  isOpen: boolean;
  index: number;
  onJoin: (id: string) => void;
}

const CommunityEvent = ({ 
  id,
  title, 
  date, 
  location,
  participants,
  ticketCost,
  isOpen,
  index,
  onJoin
}: CommunityEventProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex flex-col sm:flex-row sm:justify-between rounded-lg border bg-card p-4 shadow-sm gap-4"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          {isOpen ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Open</Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">Closed</Badge>
          )}
        </div>
        
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            <span>{participants} participating</span>
          </div>
          {ticketCost !== null && (
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3" />
              <span>${ticketCost.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <Button 
          disabled={!isOpen} 
          onClick={() => onJoin(id)}
        >
          {isOpen ? 'Join' : 'Closed'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CommunityEvent;
