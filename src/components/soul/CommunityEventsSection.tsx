
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CommunityEvent from "./CommunityEvent";
import { Users, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  ticket_cost: number | null;
  is_open: boolean;
}

const CommunityEventsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_events')
        .select('*')
        .order('event_date', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedEvents: Event[] = data.map(event => ({
          id: event.id,
          title: event.title,
          date: new Date(event.event_date).toLocaleString(),
          location: event.location,
          participants: event.participants,
          ticket_cost: event.ticket_cost,
          is_open: event.is_open
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load community events');
    } finally {
      setLoading(false);
    }
  };
  
  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast.error('Please sign in to join this event');
      return;
    }
    
    try {
      // First get the current event to check if it's open and get current participants
      const { data: eventData, error: fetchError } = await supabase
        .from('community_events')
        .select('*')
        .eq('id', eventId)
        .single();
        
      if (fetchError) throw fetchError;
      
      if (!eventData.is_open) {
        toast.error('This event is no longer open for registration');
        return;
      }
      
      // Update participant count
      const { error: updateError } = await supabase
        .from('community_events')
        .update({ participants: eventData.participants + 1 })
        .eq('id', eventId);
        
      if (updateError) throw updateError;
      
      toast.success(`You've successfully joined: ${eventData.title}`);
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event');
    }
  };
  
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
            Connect with like-minded individuals through community events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-4">No upcoming events found</div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <CommunityEvent 
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  participants={event.participants}
                  ticketCost={event.ticket_cost}
                  isOpen={event.is_open}
                  index={index}
                  onJoin={handleJoinEvent}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create New Event
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CommunityEventsSection;
