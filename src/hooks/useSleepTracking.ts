
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SleepEntry {
  id: string;
  user_id: string;
  date: string;
  bedtime: string;
  wake_up_time: string;
  sleep_quality: string;
  notes: string;
  created_at: string;
}

export const useSleepTracking = () => {
  const [sleepData, setSleepData] = useState<SleepEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch sleep data for the last 30 days
  useEffect(() => {
    const fetchSleepData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data, error } = await supabase
          .from("sleep_entries")
          .select("*")
          .eq("user_id", user.id)
          .gte("date", thirtyDaysAgo.toISOString().split('T')[0])
          .order("date", { ascending: false });

        if (error) {
          setError(error);
          toast({
            title: "Error fetching sleep data",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        setSleepData(data || []);
      } catch (err) {
        const error = err as Error;
        setError(error);
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
  }, [user, toast]);

  const addSleepEntry = async (entry: Omit<SleepEntry, 'id' | 'user_id' | 'created_at'>) => {
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
      const { data, error } = await supabase
        .from("sleep_entries")
        .insert([{
          ...entry,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error saving sleep data",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setSleepData(prev => [data, ...prev]);
      toast({
        title: "Sleep data saved",
        description: "Your sleep entry has been successfully saved.",
      });
      return true;
    } catch (error) {
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

  const updateSleepEntry = async (id: string, updates: Partial<SleepEntry>) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sleep_entries")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: "Error updating sleep data",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setSleepData(prev => prev.map(entry => entry.id === id ? data : entry));
      toast({
        title: "Sleep data updated",
        description: "Your sleep entry has been successfully updated.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Failed to update sleep data. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSleepEntry = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("sleep_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        toast({
          title: "Error deleting sleep data",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setSleepData(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: "Sleep data deleted",
        description: "Your sleep entry has been successfully deleted.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Failed to delete sleep data. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Calculate average sleep and trend
  const averageSleep = useMemo(() => {
    if (sleepData.length === 0) return null;

    const recentEntries = sleepData.slice(0, 7); // Last 7 days
    if (recentEntries.length === 0) return null;

    const totalHours = recentEntries.reduce((sum, entry) => {
      const bedtime = new Date(`2000-01-01 ${entry.bedtime}`);
      const wakeTime = new Date(`2000-01-01 ${entry.wake_up_time}`);
      
      // Handle overnight sleep
      if (wakeTime < bedtime) {
        wakeTime.setDate(wakeTime.getDate() + 1);
      }
      
      const hours = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    return totalHours / recentEntries.length;
  }, [sleepData]);

  const sleepTrend = useMemo(() => {
    if (sleepData.length < 14) return null;

    const recent7Days = sleepData.slice(0, 7);
    const previous7Days = sleepData.slice(7, 14);

    const getAverage = (entries: SleepEntry[]) => {
      const totalHours = entries.reduce((sum, entry) => {
        const bedtime = new Date(`2000-01-01 ${entry.bedtime}`);
        const wakeTime = new Date(`2000-01-01 ${entry.wake_up_time}`);
        
        if (wakeTime < bedtime) {
          wakeTime.setDate(wakeTime.getDate() + 1);
        }
        
        const hours = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      return totalHours / entries.length;
    };

    const recentAvg = getAverage(recent7Days);
    const previousAvg = getAverage(previous7Days);
    const percentChange = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);

    return {
      percentChange: Math.abs(percentChange),
      isIncreasing: percentChange > 0,
    };
  }, [sleepData]);

  return {
    sleepData,
    loading,
    error,
    isLoading: loading,
    addSleepEntry,
    updateSleepEntry,
    deleteSleepEntry,
    averageSleep,
    sleepTrend,
  };
};
