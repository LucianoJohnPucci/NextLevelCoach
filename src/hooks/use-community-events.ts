
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { format, isSameDay } from "date-fns";

export interface Event {
  id: string;
  title: string;
  date: string;
  event_date: string; // Raw date string from database
  location: string;
  participants: number;
  ticket_cost: number | null;
  is_open: boolean;
}

export interface EventFormData {
  title: string;
  location: string;
  event_date: Date;
  notes?: string;
  is_free: boolean;
  ticket_cost?: number;
  max_participants: number;
}

export function useCommunityEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
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
          event_date: event.event_date, // Store raw date string
          location: event.location,
          participants: event.participants,
          ticket_cost: event.ticket_cost,
          is_open: event.is_open
        }));
        
        // Extract dates for the calendar
        const dates = data.map(event => new Date(event.event_date));
        
        setEvents(formattedEvents);
        setEventDates(dates);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load community events');
    } finally {
      setLoading(false);
    }
  };
  
  const searchEvents = async (searchLocation: string, searchDate: Date | undefined, priceFilter: string | null) => {
    try {
      setLoading(true);
      
      let query = supabase.from('community_events').select('*');
      
      if (searchLocation) {
        query = query.ilike('location', `%${searchLocation}%`);
      }
      
      if (searchDate) {
        const formattedDate = format(searchDate, 'yyyy-MM-dd');
        query = query.gte('event_date', `${formattedDate}T00:00:00Z`)
                     .lt('event_date', `${formattedDate}T23:59:59Z`);
      }
      
      // Add price filter
      if (priceFilter === 'free') {
        query = query.is('ticket_cost', null);
      } else if (priceFilter === 'paid') {
        query = query.not('ticket_cost', 'is', null);
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
          event_date: event.event_date,
          location: event.location,
          participants: event.participants,
          ticket_cost: event.ticket_cost,
          is_open: event.is_open
        }));
        setEvents(formattedEvents);
        toast.success('Search results loaded');
      }
    } catch (error) {
      console.error('Error searching events:', error);
      toast.error('Failed to search community events');
    } finally {
      setLoading(false);
    }
  };

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    if (!date) return [];
    
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return isSameDay(eventDate, date);
    });
  }, [events]);

  const createEvent = async (eventData: EventFormData) => {
    if (!user) {
      toast.error('Please sign in to create an event');
      return;
    }
    
    try {
      const { is_free, ticket_cost, ...restData } = eventData;
      
      const { error } = await supabase
        .from('community_events')
        .insert({
          user_id: user.id,
          title: eventData.title,
          location: eventData.location,
          event_date: eventData.event_date.toISOString(),
          notes: eventData.notes || null,
          ticket_cost: is_free ? null : ticket_cost,
          participants: 0,
          is_open: true
        });
        
      if (error) throw error;
      
      toast.success('Event created successfully!');
      fetchEvents(); // Reload events after creation
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  };
  
  const joinEvent = async (eventId: string) => {
    if (!user) {
      toast.error('Please sign in to join this event');
      return;
    }
    
    try {
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
      
      const { error: updateError } = await supabase
        .from('community_events')
        .update({ participants: eventData.participants + 1 })
        .eq('id', eventId);
        
      if (updateError) throw updateError;
      
      toast.success(`You've successfully joined: ${eventData.title}`);
      fetchEvents();
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event');
    }
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  return {
    events,
    eventDates,
    loading,
    fetchEvents,
    searchEvents,
    createEvent,
    joinEvent,
    getEventsForDate
  };
}
