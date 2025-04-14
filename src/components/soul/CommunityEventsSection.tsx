
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import CommunityEvent from "./CommunityEvent";
import { Users, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-mobile";
import { format } from "date-fns";

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
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState<Date | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
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
  
  const handleSearchEvents = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('community_events').select('*');
      
      if (searchLocation) {
        query = query.ilike('location', `%${searchLocation}%`);
      }
      
      if (searchDate) {
        // Format date to match PostgreSQL format: YYYY-MM-DD
        const formattedDate = format(searchDate, 'yyyy-MM-dd');
        query = query.gte('event_date', `${formattedDate}T00:00:00Z`)
                     .lt('event_date', `${formattedDate}T23:59:59Z`);
      }
      
      const { data, error } = await query.order('event_date', { ascending: true });
        
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
        setIsSearchOpen(false);
        toast.success('Search results loaded');
      }
    } catch (error) {
      console.error('Error searching events:', error);
      toast.error('Failed to search community events');
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

  const SearchDialog = () => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Search Events</DialogTitle>
        <DialogDescription>
          Search for community events by location or date.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            placeholder="Enter city or venue"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Date</label>
          <Calendar
            mode="single"
            selected={searchDate}
            onSelect={setSearchDate}
            className="rounded-md border"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSearchEvents}>Search</Button>
      </DialogFooter>
    </DialogContent>
  );

  const SearchDrawer = () => (
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>Search Events</DrawerTitle>
        <DrawerDescription>
          Search for community events by location or date.
        </DrawerDescription>
      </DrawerHeader>
      <div className="px-4">
        <div className="grid gap-2 mb-4">
          <label htmlFor="location-mobile" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="location-mobile"
            placeholder="Enter city or venue"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        <div className="grid gap-2 mb-4">
          <label className="text-sm font-medium">Date</label>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={searchDate}
              onSelect={setSearchDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>
      <DrawerFooter className="pt-2">
        <Button onClick={handleSearchEvents}>Search Events</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
  
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
        <CardFooter className="flex flex-col gap-2">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create New Event
          </Button>
          
          {isMobile ? (
            <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Search className="h-4 w-4" /> Search Global Calendar
                </Button>
              </DrawerTrigger>
              <SearchDrawer />
            </Drawer>
          ) : (
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Search className="h-4 w-4" /> Search Global Calendar
                </Button>
              </DialogTrigger>
              <SearchDialog />
            </Dialog>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CommunityEventsSection;
