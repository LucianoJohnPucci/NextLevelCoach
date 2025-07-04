
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSoulMetrics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split("T")[0];

  // Fetch today's metrics
  const { data: todayMetrics, isLoading, isError } = useQuery({
    queryKey: ["soul-metrics", user?.id, today],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("soul_metrics")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data || {
        reflection_minutes: 0,
        connections_attended: 0,
        gratitude_streak_days: 0,
      };
    },
    enabled: !!user,
  });

  // Update metrics mutation
  const updateMetricsMutation = useMutation({
    mutationFn: async (updates: Partial<{
      reflection_minutes: number;
      connections_attended: number;
      gratitude_streak_days: number;
    }>) => {
      if (!user) throw new Error("User not authenticated");

      const currentMetrics = todayMetrics || {
        reflection_minutes: 0,
        connections_attended: 0,
        gratitude_streak_days: 0,
      };

      const { error } = await supabase
        .from("soul_metrics")
        .upsert({
          user_id: user.id,
          date: today,
          reflection_minutes: updates.reflection_minutes ?? currentMetrics.reflection_minutes,
          connections_attended: updates.connections_attended ?? currentMetrics.connections_attended,
          gratitude_streak_days: updates.gratitude_streak_days ?? currentMetrics.gratitude_streak_days,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soul-metrics"] });
    },
    onError: (error) => {
      console.error("Error updating soul metrics:", error);
      toast({
        title: "Error",
        description: "Failed to update soul metrics.",
        variant: "destructive",
      });
    },
  });

  const updateMetrics = (updates: Partial<{
    reflection_minutes: number;
    connections_attended: number;
    gratitude_streak_days: number;
  }>) => {
    updateMetricsMutation.mutate(updates);
  };

  return {
    todayMetrics,
    isLoading,
    isError,
    updateMetrics,
    reflectionMinutes: todayMetrics?.reflection_minutes || 0,
    connectionsAttended: todayMetrics?.connections_attended || 0,
    gratitudeStreak: todayMetrics?.gratitude_streak_days || 0,
  };
};
