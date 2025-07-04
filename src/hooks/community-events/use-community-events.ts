import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: string;
  created_at: string;
}

export const useCommunityEvents = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
	const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("community_events")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching community events:", error);
          toast({
            title: "Error",
            description: "Failed to fetch community events. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching community events:", error);
        toast({
          title: "Error",
          description: "Failed to fetch community events. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const addEvent = async (
    title: string,
    description: string,
    date: string,
    time: string,
    location: string,
    organizer: string,
    category: string
  ) => {
		if (!user) {
			toast({
				title: "Error",
				description: "You must be logged in to add a community event.",
				variant: "destructive",
			});
			return false;
		}

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("community_events")
        .insert([
          {
            title,
            description,
            date,
            time,
            location,
            organizer,
            category,
						user_id: user.id,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding community event:", error);
        toast({
          title: "Error",
          description: "Failed to add community event. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        setEvents((prevEvents) => [...prevEvents, data[0]]);
        toast({
          title: "Success",
          description: "Community event added successfully!",
        });
      }
    } catch (error) {
      console.error("Error adding community event:", error);
      toast({
        title: "Error",
        description: "Failed to add community event. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
		return true;
  };

  const updateEvent = async (
    id: string,
    title: string,
    description: string,
    date: string,
    time: string,
    location: string,
    organizer: string,
    category: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("community_events")
        .update({
          title,
          description,
          date,
          time,
          location,
          organizer,
          category,
        })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating community event:", error);
        toast({
          title: "Error",
          description: "Failed to update community event. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (data) {
        setEvents((prevEvents) =>
          prevEvents.map((event) => (event.id === id ? data[0] : event))
        );
        toast({
          title: "Success",
          description: "Community event updated successfully!",
        });
      }
    } catch (error) {
      console.error("Error updating community event:", error);
      toast({
        title: "Error",
        description: "Failed to update community event. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
		return true;
  };

  const deleteEvent = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("community_events")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting community event:", error);
        toast({
          title: "Error",
          description: "Failed to delete community event. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
      toast({
        title: "Success",
        description: "Community event deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting community event:", error);
      toast({
        title: "Error",
        description: "Failed to delete community event. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
		return true;
  };

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
