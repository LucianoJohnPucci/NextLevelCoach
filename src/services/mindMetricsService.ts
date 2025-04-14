
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export interface MindMetrics {
  id: string;
  user_id: string;
  date: string;
  meditation_minutes: number;
  streak_days: number;
  focus_score: number;
  mind_goals: string | null;
  created_at: Date;
  updated_at: Date;
}

// Fetch mind metrics for the current day
export const fetchTodayMindMetrics = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const { data, error } = await supabase
    .from("mind_metrics")
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

// Fetch mind metrics for the current week
export const fetchWeeklyMindMetrics = async (userId: string) => {
  // Get date from 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const startDate = sevenDaysAgo.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from("mind_metrics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .order("date", { ascending: false });
  
  if (error) throw error;
  
  return data.map(item => ({
    ...item,
    created_at: new Date(item.created_at),
    updated_at: new Date(item.updated_at)
  }));
};

// Update or create mind metrics
export const updateMindMetrics = async (
  userId: string,
  metrics: {
    meditation_minutes?: number;
    streak_days?: number;
    focus_score?: number;
    mind_goals?: string;
  }
) => {
  const today = new Date().toISOString().split('T')[0];
  
  // First check if today's record exists
  const { data: existingData } = await supabase
    .from("mind_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();
  
  if (existingData) {
    // Update existing record
    const { data, error } = await supabase
      .from("mind_metrics")
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
      .from("mind_metrics")
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

// Record meditation session
export const recordMeditationSession = async (userId: string, minutes: number) => {
  const today = new Date().toISOString().split('T')[0];
  
  // First get today's metrics
  const { data: existingData } = await supabase
    .from("mind_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();
  
  if (existingData) {
    // Update existing record with added minutes and increased streak
    const { data, error } = await supabase
      .from("mind_metrics")
      .update({
        meditation_minutes: existingData.meditation_minutes + minutes,
        streak_days: existingData.streak_days, // Maintain streak
        updated_at: new Date().toISOString()
      })
      .eq("id", existingData.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Get the most recent entry to check if we need to continue streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const { data: lastEntry } = await supabase
      .from("mind_metrics")
      .select("*")
      .eq("user_id", userId)
      .lte("date", yesterdayStr)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    const streak = lastEntry && lastEntry.date === yesterdayStr ? 
      lastEntry.streak_days + 1 : 1;
    
    // Create new record with minutes and new/reset streak
    const { data, error } = await supabase
      .from("mind_metrics")
      .insert({
        user_id: userId,
        date: today,
        meditation_minutes: minutes,
        streak_days: streak,
        focus_score: lastEntry?.focus_score || 50, // Default to 50 if no previous
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// React Query hook for mind metrics
export const useMindMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query for fetching today's metrics
  const todayQuery = useQuery({
    queryKey: ["mind-metrics", "today", user?.id],
    queryFn: () => fetchTodayMindMetrics(user?.id || ""),
    enabled: !!user,
  });
  
  // Query for fetching weekly metrics
  const weeklyQuery = useQuery({
    queryKey: ["mind-metrics", "weekly", user?.id],
    queryFn: () => fetchWeeklyMindMetrics(user?.id || ""),
    enabled: !!user,
  });
  
  // Calculate total weekly meditation minutes
  const weeklyMinutes = useMemo(() => {
    if (!weeklyQuery.data) return 0;
    return weeklyQuery.data.reduce((sum, day) => sum + day.meditation_minutes, 0);
  }, [weeklyQuery.data]);
  
  // Get current streak
  const currentStreak = useMemo(() => {
    if (!todayQuery.data) return weeklyQuery.data?.[0]?.streak_days || 0;
    return todayQuery.data.streak_days;
  }, [todayQuery.data, weeklyQuery.data]);
  
  // Get current focus score
  const focusScore = useMemo(() => {
    if (!todayQuery.data) return weeklyQuery.data?.[0]?.focus_score || 0;
    return todayQuery.data.focus_score;
  }, [todayQuery.data, weeklyQuery.data]);
  
  // Mutation for recording meditation session
  const recordSessionMutation = useMutation({
    mutationFn: ({minutes}: {minutes: number}) => {
      if (!user) throw new Error("User must be authenticated to record session");
      return recordMeditationSession(user.id, minutes);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["mind-metrics", "today", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["mind-metrics", "weekly", user?.id] });
    }
  });
  
  // Mutation for updating metrics
  const updateMetricsMutation = useMutation({
    mutationFn: (metrics: {
      meditation_minutes?: number;
      streak_days?: number;
      focus_score?: number;
      mind_goals?: string;
    }) => {
      if (!user) throw new Error("User must be authenticated to update metrics");
      return updateMindMetrics(user.id, metrics);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["mind-metrics", "today", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["mind-metrics", "weekly", user?.id] });
    }
  });
  
  return {
    todayMetrics: todayQuery.data,
    weeklyMetrics: weeklyQuery.data,
    weeklyMinutes,
    currentStreak,
    focusScore,
    isLoading: todayQuery.isLoading || weeklyQuery.isLoading,
    isError: todayQuery.isError || weeklyQuery.isError,
    error: todayQuery.error || weeklyQuery.error,
    recordSession: recordSessionMutation.mutate,
    updateMetrics: updateMetricsMutation.mutate,
    isRecording: recordSessionMutation.isPending,
    isUpdating: updateMetricsMutation.isPending,
  };
};
