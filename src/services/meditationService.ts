import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Meditation {
  id: string;
  title: string;
  duration: number;
  type: string;
}

interface MeditationMetrics {
  totalMeditations: number;
  totalMinutes: number;
  averageDuration: number;
}

export const useMeditationMetrics = () => {
  const { user } = useAuth();
  
  const fetchMeditationMetrics = async (): Promise<MeditationMetrics> => {
    if (!user) {
      return { totalMeditations: 0, totalMinutes: 0, averageDuration: 0 };
    }
    
    try {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('duration')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching meditation sessions:", error);
        return { totalMeditations: 0, totalMinutes: 0, averageDuration: 0 };
      }
      
      const totalMeditations = data.length;
      const totalMinutes = data.reduce((sum, session) => sum + session.duration, 0);
      const averageDuration = totalMeditations > 0 ? totalMinutes / totalMeditations : 0;
      
      return {
        totalMeditations,
        totalMinutes,
        averageDuration,
      };
    } catch (error) {
      console.error("Error calculating meditation metrics:", error);
      return { totalMeditations: 0, totalMinutes: 0, averageDuration: 0 };
    }
  };
  
  return useQuery(['meditationMetrics', user?.id], fetchMeditationMetrics, {
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMeditationSessions = () => {
  const { user } = useAuth();
  
  const fetchMeditationSessions = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching meditation sessions:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error fetching meditation sessions:", error);
      return [];
    }
  };
  
  return useQuery(['meditationSessions', user?.id], fetchMeditationSessions, {
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAddMeditationSession = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation(
    async (newSession: { duration: number; type: string }) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert([{ ...newSession, user_id: user.id }]);
      
      if (error) {
        console.error("Error adding meditation session:", error);
        throw error;
      }
      
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['meditationSessions', user?.id]);
        queryClient.invalidateQueries(['meditationMetrics', user?.id]);
      },
    }
  );
};
