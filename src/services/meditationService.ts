
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  benefits: string;
  is_enabled?: boolean;
  improves_focus?: boolean;
  reduces_stress?: boolean;
  promotes_calm?: boolean;
  improves_sleep?: boolean;
  enhances_clarity?: boolean;
}

export const useMeditationSessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState(false);

  // Fetch all meditation sessions with user preferences
  const { data: sessions = [], isLoading, isError } = useQuery({
    queryKey: ["meditation-sessions", user?.id],
    queryFn: async () => {
      // First get all meditation sessions
      const { data: allSessions, error: sessionsError } = await supabase
        .from("meditation_sessions")
        .select("*")
        .order("title");

      if (sessionsError) throw sessionsError;

      if (!user) {
        return allSessions?.map(session => ({
          ...session,
          is_enabled: false,
          improves_focus: session.benefits.includes("focus"),
          reduces_stress: session.benefits.includes("stress"),
          promotes_calm: session.benefits.includes("calm"),
          improves_sleep: session.benefits.includes("sleep"),
          enhances_clarity: session.benefits.includes("clarity"),
        })) || [];
      }

      // Then get user preferences
      const { data: preferences, error: prefsError } = await supabase
        .from("user_meditation_preferences")
        .select("session_id, is_enabled")
        .eq("user_id", user.id);

      if (prefsError) throw prefsError;

      // Merge sessions with user preferences
      const prefsMap = new Map(preferences?.map(p => [p.session_id, p.is_enabled]) || []);

      return allSessions?.map(session => ({
        ...session,
        is_enabled: prefsMap.get(session.id) || false,
        improves_focus: session.benefits.includes("focus"),
        reduces_stress: session.benefits.includes("stress"),
        promotes_calm: session.benefits.includes("calm"),
        improves_sleep: session.benefits.includes("sleep"),
        enhances_clarity: session.benefits.includes("clarity"),
      })) || [];
    },
  });

  // Toggle session preference
  const toggleSessionPreference = useMutation({
    mutationFn: async ({ sessionId, enabled }: { sessionId: string; enabled: boolean }) => {
      if (!user) throw new Error("User must be authenticated");

      const { error } = await supabase
        .from("user_meditation_preferences")
        .upsert({
          user_id: user.id,
          session_id: sessionId,
          is_enabled: enabled,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meditation-sessions"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update meditation preference",
        variant: "destructive",
      });
    },
  });

  const handleToggleSession = async (session: MeditationSession, enabled: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save meditation preferences",
        variant: "destructive",
      });
      return;
    }

    setIsToggling(true);
    try {
      await toggleSessionPreference.mutateAsync({
        sessionId: session.id,
        enabled,
      });
    } finally {
      setIsToggling(false);
    }
  };

  return {
    sessions,
    isLoading,
    isError,
    isToggling,
    handleToggleSession,
  };
};
