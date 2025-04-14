
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CommunityEvent from "./CommunityEvent";
import EventSearch from "./EventSearch";
import EventForm from "./EventForm";
import { useCommunityEvents } from "@/hooks/use-community-events";

const CommunityEventsSection = () => {
  const { events, eventDates, loading, joinEvent, searchEvents, fetchEvents, createEvent } = useCommunityEvents();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
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
                  onJoin={joinEvent}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Create New Event
          </Button>
          
          <EventSearch 
            onSearch={(location, date, priceFilter) => searchEvents(location, date, priceFilter)} 
            onClearFilter={fetchEvents}
            eventDates={eventDates}
          />
        </CardFooter>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new community event.
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            onSubmit={createEvent}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CommunityEventsSection;
