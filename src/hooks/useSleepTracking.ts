import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SleepData {
  id: string;
  user_id: string;
  date: string;
  bedtime: string;
  wake_time: string;
  sleep_duration: number;
  sleep_quality: number;
  notes: string;
  created_at: string;
}

export const useSleepTracking = () => {
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchSleepData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("sleep_data")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .single();

        if (error) {
          console.error("Error fetching sleep data:", error);
          toast({
            title: "Error fetching sleep data",
            description: error.message,
            variant: "destructive",
          });
        }

        setSleepData(data);
      } catch (error) {
        console.error("Unexpected error fetching sleep data:", error);
        toast({
          title: "Unexpected error",
          description: "Failed to retrieve sleep data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSleepData();
  }, [user, today, toast]);

  const saveSleepData = async (
    bedtime: string,
    wake_time: string,
    sleep_duration: number,
    sleep_quality: number,
    notes: string
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save sleep data.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const sleepEntry = {
        user_id: user.id,
        date: today,
        bedtime,
        wake_time,
        sleep_duration,
        sleep_quality,
        notes,
      };

      const { data, error } = sleepData
        ? await supabase
            .from("sleep_data")
            .update(sleepEntry)
            .eq("id", sleepData.id)
            .select()
            .single()
        : await supabase.from("sleep_data").insert([sleepEntry]).select().single();

      if (error) {
        console.error("Error saving sleep data:", error);
        toast({
          title: "Error saving sleep data",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setSleepData(data as SleepData);
      toast({
        title: "Sleep data saved",
        description: "Your sleep data has been successfully saved.",
      });
      return true;
    } catch (error) {
      console.error("Unexpected error saving sleep data:", error);
      toast({
        title: "Unexpected error",
        description: "Failed to save sleep data. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sleepData, loading, saveSleepData };
};
