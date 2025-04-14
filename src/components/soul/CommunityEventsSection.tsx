
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CommunityEvent from "./CommunityEvent";
import { Users } from "lucide-react";

interface Event {
  title: string;
  date: string;
  participants: number;
}

interface CommunityEventsSectionProps {
  events: Event[];
}

const CommunityEventsSection = ({ events }: CommunityEventsSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Events
          </CardTitle>
          <CardDescription>
            Connect with like-minded individuals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <CommunityEvent 
                key={index}
                title={event.title}
                date={event.date}
                participants={event.participants}
                index={index}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Events
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CommunityEventsSection;
