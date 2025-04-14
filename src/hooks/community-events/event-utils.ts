
import { supabase } from "@/integrations/supabase/client";
import { Event, EventFormData } from "./types";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";

// Format events from database response
export const formatEvents = (data: any[]): Event[] => {
  return data.map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.event_date).toLocaleString(),
    event_date: event.event_date,
    location: event.location,
    participants: event.participants,
    ticket_cost: event.ticket_cost,
    is_open: event.is_open
  }));
};

// Filter events for a specific date
export const filterEventsByDate = (events: Event[], date: Date | undefined): Event[] => {
  if (!date || !events.length) return [];
  
  return events.filter(event => {
    const eventDate = new Date(event.event_date);
    return isSameDay(eventDate, date);
  });
};

// Fetch all events from the database
export const fetchAllEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('community_events')
      .select('*')
      .order('event_date', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    if (data) {
      const formattedEvents = formatEvents(data);
      const dates = data.map(event => new Date(event.event_date));
      
      return { events: formattedEvents, dates };
    }
    return { events: [], dates: [] };
  } catch (error) {
    console.error('Error fetching events:', error);
    toast.error('Failed to load community events');
    return { events: [], dates: [] };
  }
};

// Search events with filters
export const searchEventsWithFilters = async (
  searchLocation: string, 
  searchDate: Date | undefined, 
  priceFilter: string | null
) => {
  try {
    let query = supabase.from('community_events').select('*');
    
    if (searchLocation) {
      query = query.ilike('location', `%${searchLocation}%`);
    }
    
    if (searchDate) {
      const formattedDate = format(searchDate, 'yyyy-MM-dd');
      query = query.gte('event_date', `${formattedDate}T00:00:00Z`)
                   .lt('event_date', `${formattedDate}T23:59:59Z`);
    }
    
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
      const formattedEvents = formatEvents(data);
      toast.success('Search results loaded');
      return formattedEvents;
    }
    return [];
  } catch (error) {
    console.error('Error searching events:', error);
    toast.error('Failed to search community events');
    return [];
  }
};

// Create a new event
export const createNewEvent = async (userId: string, eventData: EventFormData) => {
  try {
    const { is_free, ticket_cost, ...restData } = eventData;
    
    const { error } = await supabase
      .from('community_events')
      .insert({
        user_id: userId,
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
    return true;
  } catch (error) {
    console.error('Error creating event:', error);
    toast.error('Failed to create event');
    throw error;
  }
};

// Join an event
export const joinEventById = async (userId: string, eventId: string) => {
  try {
    const { data: eventData, error: fetchError } = await supabase
      .from('community_events')
      .select('*')
      .eq('id', eventId)
      .single();
      
    if (fetchError) throw fetchError;
    
    if (!eventData.is_open) {
      toast.error('This event is no longer open for registration');
      return false;
    }
    
    const { error: updateError } = await supabase
      .from('community_events')
      .update({ participants: eventData.participants + 1 })
      .eq('id', eventId);
      
    if (updateError) throw updateError;
    
    toast.success(`You've successfully joined: ${eventData.title}`);
    return true;
  } catch (error) {
    console.error('Error joining event:', error);
    toast.error('Failed to join event');
    return false;
  }
};
