import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface SoulMetrics {
  reflection_minutes: number;
  connections_attended: number;
  gratitude_streak_days: number;
}

const defaultSoulMetrics: SoulMetrics = {
  reflection_minutes: 0,
  connections_attended: 0,
  gratitude_streak_days: 0,
};

const fetchSoulMetrics = async (userId: string | undefined) => {
  if (!userId) {
    return defaultSoulMetrics;
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_entries')
      .select('reflection_minutes, connections_attended, gratitude_streak_days')
      .eq('user_id', userId)
      .eq('date', today)
      .single();
    
    if (error) {
      console.error("Error fetching soul metrics:", error);
      return defaultSoulMetrics;
    }
    
    return data ? {
      reflection_minutes: data.reflection_minutes || 0,
      connections_attended: data.connections_attended || 0,
      gratitude_streak_days: data.gratitude_streak_days || 0,
    } : defaultSoulMetrics;
  } catch (error) {
    console.error("Error fetching soul metrics:", error);
    return defaultSoulMetrics;
  }
};

const updateSoulMetrics = async (
  userId: string | undefined,
  updates: Partial<SoulMetrics>
) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('daily_entries')
      .update(updates)
      .eq('user_id', userId)
      .eq('date', today);
    
    if (error) {
      console.error("Error updating soul metrics:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error updating soul metrics:", error);
    throw error;
  }
};

export const useSoulMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { 
    data: todayMetrics,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["soulMetrics", user?.id],
    queryFn: () => fetchSoulMetrics(user?.id),
    initialData: defaultSoulMetrics,
  });
  
  const reflectionMinutes = todayMetrics?.reflection_minutes || 0;
  const connectionsAttended = todayMetrics?.connections_attended || 0;
  const gratitudeStreak = todayMetrics?.gratitude_streak_days || 0;
  
  const { mutate: updateMetrics } = useMutation(
    (updates: Partial<SoulMetrics>) => updateSoulMetrics(user?.id, updates),
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["soulMetrics", user?.id]);
        refetch();
      },
    }
  );

  return {
    todayMetrics,
    reflectionMinutes,
    connectionsAttended,
    gratitudeStreak,
    isLoading,
    isError,
    updateMetrics,
  };
};
