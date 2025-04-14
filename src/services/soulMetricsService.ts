
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export interface SoulMetrics {
  id: string;
  user_id: string;
  date: string;
  reflection_minutes: number;
  connections_attended: number;
  gratitude_streak_days: number;
  created_at: Date;
  updated_at: Date;
}

// Fetch soul metrics for the current day
export const fetchTodaySoulMetrics = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const { data, error } = await supabase
    .from("soul_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();
  
  if (error) throw error;
  
  if (!data) return null;
  
  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at)
  };
};

// Fetch soul metrics for the current week
export const fetchWeeklySoulMetrics = async (userId: string) => {
  // Get date from 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const startDate = sevenDaysAgo.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from("soul_metrics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .order("date", { ascending: false });
  
  if (error) throw error;
  
  return data ? data.map(item => ({
    ...item,
    created_at: new Date(item.created_at),
    updated_at: new Date(item.updated_at)
  })) : [];
};

// Update or create soul metrics
export const updateSoulMetrics = async (
  userId: string,
  metrics: {
    reflection_minutes?: number;
    connections_attended?: number;
    gratitude_streak_days?: number;
  }
) => {
  const today = new Date().toISOString().split('T')[0];
  
  // First check if today's record exists
  const { data: existingData } = await supabase
    .from("soul_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();
  
  if (existingData) {
    // Update existing record
    const { data, error } = await supabase
      .from("soul_metrics")
      .update({
        ...metrics,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingData.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Create new record
    const { data, error } = await supabase
      .from("soul_metrics")
      .insert({
        user_id: userId,
        date: today,
        ...metrics
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// React Query hook for soul metrics
export const useSoulMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query for fetching today's metrics
  const todayQuery = useQuery({
    queryKey: ["soul-metrics", "today", user?.id],
    queryFn: () => fetchTodaySoulMetrics(user?.id || ""),
    enabled: !!user,
  });
  
  // Query for fetching weekly metrics
  const weeklyQuery = useQuery({
    queryKey: ["soul-metrics", "weekly", user?.id],
    queryFn: () => fetchWeeklySoulMetrics(user?.id || ""),
    enabled: !!user,
  });
  
  // Get current reflection minutes
  const reflectionMinutes = useMemo(() => {
    if (!todayQuery.data) return 0;
    return todayQuery.data.reflection_minutes;
  }, [todayQuery.data]);
  
  // Get connections attended
  const connectionsAttended = useMemo(() => {
    if (!todayQuery.data) return 0;
    return todayQuery.data.connections_attended;
  }, [todayQuery.data]);
  
  // Get gratitude streak
  const gratitudeStreak = useMemo(() => {
    if (!todayQuery.data) return 0;
    return todayQuery.data.gratitude_streak_days;
  }, [todayQuery.data]);
  
  // Mutation for updating metrics
  const updateMetricsMutation = useMutation({
    mutationFn: (metrics: {
      reflection_minutes?: number;
      connections_attended?: number;
      gratitude_streak_days?: number;
    }) => {
      if (!user) throw new Error("User must be authenticated to update metrics");
      return updateSoulMetrics(user.id, metrics);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["soul-metrics", "today", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["soul-metrics", "weekly", user?.id] });
    }
  });
  
  return {
    reflectionMinutes,
    connectionsAttended,
    gratitudeStreak,
    isLoading: todayQuery.isLoading || weeklyQuery.isLoading,
    isError: todayQuery.isError || weeklyQuery.isError,
    error: todayQuery.error || weeklyQuery.error,
    updateMetrics: updateMetricsMutation.mutate,
    isUpdating: updateMetricsMutation.isPending,
    todayMetrics: todayQuery.data,
    weeklyMetrics: weeklyQuery.data,
  };
};
