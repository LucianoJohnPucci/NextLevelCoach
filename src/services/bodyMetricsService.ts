import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export interface BodyMetrics {
  id: string;
  user_id: string;
  date: string;
  workout_minutes: number;
  streak_days: number;
  calories_burned: number;
  body_goals: string | null;
  weight: number | null;
  height: number | null;
  // New persistent session counters
  yoga_count: number;
  cardio_count: number;
  strength_count: number;
  stretch_count: number;
  created_at: Date;
  updated_at: Date;
}

// Fetch body metrics for the current day
export const fetchTodayBodyMetrics = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const { data, error } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();
  
  if (error) throw error;
  
  if (!data) return null;
  
  return {
    ...data,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
    yoga_count: data.yoga_count || 0,
    cardio_count: data.cardio_count || 0,
    strength_count: data.strength_count || 0,
    stretch_count: data.stretch_count || 0
  };
};

// Fetch body metrics for the current week
export const fetchWeeklyBodyMetrics = async (userId: string) => {
  // Get date from 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const startDate = sevenDaysAgo.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .order("date", { ascending: false });
  
  if (error) throw error;
  
  return data.map(item => ({
    ...item,
    created_at: new Date(item.created_at),
    updated_at: new Date(item.updated_at),
    yoga_count: item.yoga_count || 0,
    cardio_count: item.cardio_count || 0,
    strength_count: item.strength_count || 0,
    stretch_count: item.stretch_count || 0
  }));
};

// Update or create body metrics
export const updateBodyMetrics = async (
  userId: string,
  metrics: {
    workout_minutes?: number;
    streak_days?: number;
    calories_burned?: number;
    body_goals?: string;
    weight?: number;
    height?: number;
    yoga_count?: number;
    cardio_count?: number;
    strength_count?: number;
    stretch_count?: number;
  }
) => {
  const today = new Date().toISOString().split('T')[0];
  
  // First check if today's record exists
  const { data: existingData } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();
  
  if (existingData) {
    // Update existing record
    const { data, error } = await supabase
      .from("body_metrics")
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
      .from("body_metrics")
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

// Record workout session
export const recordWorkoutSession = async (userId: string, minutes: number) => {
  const today = new Date().toISOString().split('T')[0];
  
  // First get today's metrics
  const { data: existingData } = await supabase
    .from("body_metrics")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();
  
  if (existingData) {
    // Update existing record with added minutes and increased streak
    const { data, error } = await supabase
      .from("body_metrics")
      .update({
        workout_minutes: existingData.workout_minutes + minutes,
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
      .from("body_metrics")
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
      .from("body_metrics")
      .insert({
        user_id: userId,
        date: today,
        workout_minutes: minutes,
        streak_days: streak,
        calories_burned: minutes * 0.5, // Simple calorie estimation
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// React Query hook for body metrics
export const useBodyMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query for fetching today's metrics
  const todayQuery = useQuery({
    queryKey: ["body-metrics", "today", user?.id],
    queryFn: () => fetchTodayBodyMetrics(user?.id || ""),
    enabled: !!user,
  });
  
  // Query for fetching weekly metrics
  const weeklyQuery = useQuery({
    queryKey: ["body-metrics", "weekly", user?.id],
    queryFn: () => fetchWeeklyBodyMetrics(user?.id || ""),
    enabled: !!user,
  });
  
  // Calculate total weekly workout minutes
  const weeklyMinutes = useMemo(() => {
    if (!weeklyQuery.data) return 0;
    return weeklyQuery.data.reduce((sum, day) => sum + day.workout_minutes, 0);
  }, [weeklyQuery.data]);
  
  // Get current streak
  const currentStreak = useMemo(() => {
    if (!todayQuery.data) return weeklyQuery.data?.[0]?.streak_days || 0;
    return todayQuery.data.streak_days;
  }, [todayQuery.data, weeklyQuery.data]);
  
  // Mutation for recording workout session
  const recordSessionMutation = useMutation({
    mutationFn: ({minutes}: {minutes: number}) => {
      if (!user) throw new Error("User must be authenticated to record session");
      return recordWorkoutSession(user.id, minutes);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["body-metrics", "today", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["body-metrics", "weekly", user?.id] });
    }
  });
  
  // Mutation for updating metrics
  const updateMetricsMutation = useMutation({
    mutationFn: (metrics: {
      workout_minutes?: number;
      streak_days?: number;
      calories_burned?: number;
      body_goals?: string;
      weight?: number;
      height?: number;
      yoga_count?: number;
      cardio_count?: number;
      strength_count?: number;
      stretch_count?: number;
    }) => {
      if (!user) throw new Error("User must be authenticated to update metrics");
      return updateBodyMetrics(user.id, metrics);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["body-metrics", "today", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["body-metrics", "weekly", user?.id] });
    }
  });
  
  return {
    todayMetrics: todayQuery.data,
    weeklyMetrics: weeklyQuery.data,
    weeklyMinutes,
    currentStreak,
    isLoading: todayQuery.isLoading || weeklyQuery.isLoading,
    isError: todayQuery.isError || weeklyQuery.isError,
    error: todayQuery.error || weeklyQuery.error,
    recordSession: recordSessionMutation.mutate,
    updateMetrics: updateMetricsMutation.mutate,
    isRecording: recordSessionMutation.isPending,
    isUpdating: updateMetricsMutation.isPending,
    // Convenience: expose session counts
    sessionCounts: todayQuery.data
      ? {
          yoga: todayQuery.data.yoga_count || 0,
          cardio: todayQuery.data.cardio_count || 0,
          strength: todayQuery.data.strength_count || 0,
          stretch: todayQuery.data.stretch_count || 0,
        }
      : { yoga: 0, cardio: 0, strength: 0, stretch: 0 },
  };
};

export const calculateCaloriesBurned = (minutes: number, weight?: number) => {
  // Simple calorie calculation based on MET values
  // Assumes moderate intensity workout
  const MET = 4.0; // Moderate activity
  const weightInKg = weight ? weight * 0.453592 : 70; // Convert lbs to kg, default to 70kg
  return Math.round((MET * weightInKg * 3.5) / 200 * minutes);
};
