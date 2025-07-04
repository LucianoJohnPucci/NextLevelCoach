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
          .order("date", { ascending: true });

        if (error) {
          console.error("Error fetching community events:", error);
          toast({
            title: "Error",
            description: "Failed to load community events. Please try again.",
            variant: "destructive",
          });
        }

        if (data) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching community events:", error);
        toast({
          title: "Error",
          description: "Failed to load community events. Please try again.",
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
    setIsLoading(true);
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to add a community event.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("community_events").insert([
        {
          title,
          description,
          date,
          time,
          location,
          organizer,
          category,
        },
      ]);

      if (error) {
        console.error("Error adding community event:", error);
        toast({
          title: "Error",
          description: "Failed to add community event. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Community event added successfully!",
        });
        // Refresh events after adding
        const { data } = await supabase
          .from("community_events")
          .select("*")
          .order("date", { ascending: true });
        if (data) {
          setEvents(data);
        }
      }
    } catch (error) {
      console.error("Error adding community event:", error);
      toast({
        title: "Error",
        description: "Failed to add community event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to update a community event.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
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
        .eq("id", id);

      if (error) {
        console.error("Error updating community event:", error);
        toast({
          title: "Error",
          description: "Failed to update community event. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Community event updated successfully!",
        });
        // Refresh events after updating
        const { data } = await supabase
          .from("community_events")
          .select("*")
          .order("date", { ascending: true });
        if (data) {
          setEvents(data);
        }
      }
    } catch (error) {
      console.error("Error updating community event:", error);
      toast({
        title: "Error",
        description: "Failed to update community event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setIsLoading(true);
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to delete a community event.",
          variant: "destructive",
        });
        return;
      }

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
      } else {
        toast({
          title: "Success",
          description: "Community event deleted successfully!",
        });
        // Refresh events after deleting
        const { data } = await supabase
          .from("community_events")
          .select("*")
          .order("date", { ascending: true });
        if (data) {
          setEvents(data);
        }
      }
    } catch (error) {
      console.error("Error deleting community event:", error);
      toast({
        title: "Error",
        description: "Failed to delete community event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
