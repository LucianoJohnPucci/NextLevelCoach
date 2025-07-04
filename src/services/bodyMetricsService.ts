
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBodyMetrics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRecording, setIsRecording] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Fetch today's metrics
  const { data: todayMetrics, isLoading, isError } = useQuery({
    queryKey: ["body-metrics", user?.id, today],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("body_metrics")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data || {
        workout_minutes: 0,
        calories_burned: 0,
        streak_days: 0,
        weight: null,
        height: null,
      };
    },
    enabled: !!user,
  });

  // Update metrics mutation
  const updateMetrics = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("body_metrics")
        .upsert({
          user_id: user.id,
          date: today,
          workout_minutes: todayMetrics?.workout_minutes || 0,
          calories_burned: todayMetrics?.calories_burned || 0,
          streak_days: todayMetrics?.streak_days || 0,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body-metrics"] });
    },
  });

  // Record workout session
  const recordSession = async ({ minutes, workoutTitle }: { minutes: number; workoutTitle?: string }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to record workout sessions.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    try {
      const currentMetrics = todayMetrics || {
        workout_minutes: 0,
        calories_burned: 0,
        streak_days: 0,
      };

      const { error } = await supabase
        .from("body_metrics")
        .upsert({
          user_id: user.id,
          date: today,
          workout_minutes: currentMetrics.workout_minutes + minutes,
          calories_burned: currentMetrics.calories_burned + Math.round(minutes * 5), // Rough calculation
          streak_days: currentMetrics.streak_days,
          workout_title: workoutTitle,
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["body-metrics"] });
      
      toast({
        title: "Workout recorded!",
        description: `Added ${minutes} minutes to your daily total.`,
      });
    } catch (error) {
      console.error("Error recording workout:", error);
      toast({
        title: "Error",
        description: "Failed to record workout session.",
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };

  return {
    todayMetrics,
    isLoading,
    isError,
    updateMetrics,
    recordSession,
    isRecording,
    workoutsCompleted: todayMetrics?.workout_minutes || 0,
    averageEnergy: 75, // Mock data
    stepsTaken: 8500, // Mock data
    hydrationLevel: 2.1, // Mock data
  };
};
