
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Event, EventFormData } from "./types";
import { 
  fetchAllEvents, 
  searchEventsWithFilters, 
  filterEventsByDate,
  createNewEvent,
  joinEventById
} from "./event-utils";

export function useCommunityEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { events: fetchedEvents, dates } = await fetchAllEvents();
      setEvents(fetchedEvents);
      setEventDates(dates);
    } finally {
      setLoading(false);
    }
  };
  
  const searchEvents = async (searchLocation: string, searchDate: Date | undefined, priceFilter: string | null) => {
    try {
      setLoading(true);
      const searchResults = await searchEventsWithFilters(searchLocation, searchDate, priceFilter);
      setEvents(searchResults);
    } finally {
      setLoading(false);
    }
  };

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    if (!date) return [];
    return filterEventsByDate(events, date);
  }, [events]);

  const createEvent = async (eventData: EventFormData) => {
    if (!user) {
      throw new Error('User must be logged in to create an event');
    }
    
    await createNewEvent(user.id, eventData);
    fetchEvents(); // Reload events after creation
  };
  
  const joinEvent = async (eventId: string) => {
    if (!user) {
      throw new Error('User must be logged in to join an event');
    }
    
    const success = await joinEventById(user.id, eventId);
    if (success) {
      fetchEvents(); // Reload events after joining
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
