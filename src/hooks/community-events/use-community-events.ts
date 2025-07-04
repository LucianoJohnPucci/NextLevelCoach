
import { useState, useEffect } from "react";
import { fetchAllEvents, searchEventsWithFilters, createNewEvent, joinEventById } from "./event-utils";
import { Event, EventFormData } from "./types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const useCommunityEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventDates, setEventDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { events: fetchedEvents, dates } = await fetchAllEvents();
      setEvents(fetchedEvents);
      setEventDates(dates);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const searchEvents = async (location: string, date: Date | undefined, priceFilter: string | null) => {
    setIsLoading(true);
    try {
      const searchResults = await searchEventsWithFilters(location, date, priceFilter);
      setEvents(searchResults);
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: EventFormData) => {
    if (!user) {
      toast.error('You must be logged in to create events');
      return false;
    }

    setIsLoading(true);
    try {
      await createNewEvent(user.id, eventData);
      await fetchEvents(); // Refresh the events list
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const joinEvent = async (eventId: string) => {
    if (!user) {
      toast.error('You must be logged in to join events');
      return false;
    }

    try {
      const success = await joinEventById(user.id, eventId);
      if (success) {
        await fetchEvents(); // Refresh the events list
      }
      return success;
    } catch (error) {
      console.error('Error joining event:', error);
      return false;
    }
  };

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return {
    events,
    eventDates,
    loading: isLoading,
    isLoading,
    fetchEvents,
    searchEvents,
    createEvent,
    joinEvent,
    getEventsForDate
  };
};
