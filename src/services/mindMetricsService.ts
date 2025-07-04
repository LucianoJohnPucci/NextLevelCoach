import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface MindMetrics {
  meditationMinutes: number;
  journalEntries: number;
  wisdomConsumption: number;
  averageMood: number;
}

const defaultMindMetrics: MindMetrics = {
  meditationMinutes: 0,
  journalEntries: 0,
  wisdomConsumption: 0,
  averageMood: 5,
};

export const useMindMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch today's metrics
  const { data: todayMetrics, isLoading, isError } = useQuery(
    "mindMetrics",
    async () => {
      if (!user) return defaultMindMetrics;

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("daily_entries")
        .select("meditation_minutes, journal_entries, wisdom_consumption, mood")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      if (error) {
        console.error("Error fetching mind metrics:", error);
        throw error;
      }

      return {
        meditationMinutes: data?.meditation_minutes || 0,
        journalEntries: data?.journal_entries || 0,
        wisdomConsumption: data?.wisdom_consumption || 0,
        averageMood: data?.mood || 5,
      };
    },
    {
      initialData: defaultMindMetrics,
      enabled: !!user,
    }
  );

  // Mutation to update metrics
  const updateMetricsMutation = useMutation(
    async (updates: Partial<MindMetrics>) => {
      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("daily_entries")
        .upsert(
          [
            {
              user_id: user.id,
              date: today,
              meditation_minutes: updates.meditationMinutes,
              journal_entries: updates.journalEntries,
              wisdom_consumption: updates.wisdomConsumption,
              mood: updates.averageMood,
            },
          ],
          { onConflict: "user_id, date" }
        )
        .select();

      if (error) {
        console.error("Error updating mind metrics:", error);
        throw error;
      }

      return data;
    },
    {
      onSuccess: () => {
        // Invalidate the query to refetch data
        queryClient.invalidateQueries("mindMetrics");
      },
    }
  );

  const updateMetrics = (updates: Partial<MindMetrics>) => {
    updateMetricsMutation.mutate(updates);
  };

  return {
    meditationMinutes: todayMetrics?.meditationMinutes || 0,
    journalEntries: todayMetrics?.journalEntries || 0,
    wisdomConsumption: todayMetrics?.wisdomConsumption || 0,
    averageMood: todayMetrics?.averageMood || 5,
    isLoading,
    isError,
    updateMetrics,
    todayMetrics,
  };
};
