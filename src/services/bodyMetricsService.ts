import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface BodyMetrics {
  id: string;
  user_id: string;
  date: string;
  workouts_completed: number;
  average_energy: number;
  steps_taken: number;
  hydration_level: number;
  created_at: string;
  updated_at: string;
}

const fetchBodyMetrics = async (userId: string): Promise<BodyMetrics | null> => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('body_metrics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error) {
    console.error("Error fetching body metrics:", error);
    return null;
  }

  return data;
};

export const useBodyMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: todayMetrics, isLoading, isError } = useQuery<BodyMetrics | null, Error>(
    ['bodyMetrics', user?.id],
    () => {
      if (!user) return null;
      return fetchBodyMetrics(user.id);
    },
    {
      enabled: !!user, // Only run the query if the user is logged in
      staleTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const { mutate: updateMetrics } = useMutation(
    async (updates: Partial<BodyMetrics>) => {
      if (!user) throw new Error("User not logged in");

      const today = new Date().toISOString().split('T')[0];
      const existingMetrics = await fetchBodyMetrics(user.id);

      if (existingMetrics) {
        // Update existing record
        const { data, error } = await supabase
          .from('body_metrics')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', existingMetrics.id)
          .select();

        if (error) {
          console.error("Error updating body metrics:", error);
          throw error;
        }
        return data ? data[0] : null;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('body_metrics')
          .insert([{ user_id: user.id, date: today, ...updates }])
          .select();

        if (error) {
          console.error("Error creating body metrics:", error);
          throw error;
        }
        return data ? data[0] : null;
      }
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['bodyMetrics', user?.id]);
      },
    }
  );

  const workoutsCompleted = todayMetrics?.workouts_completed || 0;
  const averageEnergy = todayMetrics?.average_energy || 5;
  const stepsTaken = todayMetrics?.steps_taken || 0;
  const hydrationLevel = todayMetrics?.hydration_level || 0;

  return {
    workoutsCompleted,
    averageEnergy,
    stepsTaken,
    hydrationLevel,
    todayMetrics,
    isLoading,
    isError,
    updateMetrics,
  };
};
