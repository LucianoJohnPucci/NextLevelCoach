
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: string;
  benefits: string;
  created_at: Date;
  improves_focus?: boolean;
  reduces_stress?: boolean;
  promotes_calm?: boolean;
  improves_sleep?: boolean;
  enhances_clarity?: boolean;
  is_enabled?: boolean;
}

export interface UserMeditationPreference {
  id: string;
  user_id: string;
  session_id: string;
  is_enabled: boolean;
}

// Fetch all meditation sessions
export const fetchMeditationSessions = async () => {
  const { data, error } = await supabase
    .from("meditation_sessions")
    .select("*")
    .order("title");
  
  if (error) throw error;
  
  return data.map(session => ({
    ...session,
    created_at: new Date(session.created_at)
  }));
};

// Fetch user preferences for meditation sessions
export const fetchUserMeditationPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_meditation_preferences")
    .select("*")
    .eq("user_id", userId);
  
  if (error) throw error;
  
  return data;
};

// Toggle meditation session enabled/disabled status
export const toggleMeditationSessionStatus = async (
  sessionId: string, 
  userId: string, 
  isEnabled: boolean
) => {
  // Check if preference already exists
  const { data: existingPref, error: fetchError } = await supabase
    .from("user_meditation_preferences")
    .select("*")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  
  if (fetchError) throw fetchError;
  
  if (existingPref) {
    // Update existing preference
    const { error } = await supabase
      .from("user_meditation_preferences")
      .update({ is_enabled: isEnabled })
      .eq("id", existingPref.id);
    
    if (error) throw error;
    return { ...existingPref, is_enabled: isEnabled };
  } else {
    // Create new preference
    const { data, error } = await supabase
      .from("user_meditation_preferences")
      .insert({
        user_id: userId,
        session_id: sessionId,
        is_enabled: isEnabled
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// React Query hook for meditation sessions with user preferences
export const useMeditationSessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query for fetching sessions
  const sessionsQuery = useQuery({
    queryKey: ["meditation-sessions"],
    queryFn: fetchMeditationSessions,
    enabled: true // Always fetch sessions, even for non-authenticated users
  });
  
  // Query for fetching user preferences (only if user is authenticated)
  const preferencesQuery = useQuery({
    queryKey: ["meditation-preferences", user?.id],
    queryFn: () => fetchUserMeditationPreferences(user?.id || ""),
    enabled: !!user, // Only run if user is authenticated
  });
  
  // Combine sessions with preferences
  const combinedData = useMemo(() => {
    if (!sessionsQuery.data) return [];
    
    return sessionsQuery.data.map(session => {
      // Find user preference for this session
      const preference = preferencesQuery.data?.find(
        pref => pref.session_id === session.id
      );
      
      return {
        ...session,
        is_enabled: preference?.is_enabled ?? true // Default to enabled
      };
    });
  }, [sessionsQuery.data, preferencesQuery.data]);
  
  // Mutation for toggling session status
  const toggleSessionMutation = useMutation({
    mutationFn: ({sessionId, isEnabled}: {sessionId: string; isEnabled: boolean}) => {
      if (!user) throw new Error("User must be authenticated to update preferences");
      return toggleMeditationSessionStatus(sessionId, user.id, isEnabled);
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["meditation-preferences", user?.id] });
    }
  });
  
  return {
    sessions: combinedData,
    isLoading: sessionsQuery.isLoading || (!!user && preferencesQuery.isLoading),
    isError: sessionsQuery.isError || (!!user && preferencesQuery.isError),
    error: sessionsQuery.error || (user ? preferencesQuery.error : null),
    toggleSession: toggleSessionMutation.mutate,
    isToggling: toggleSessionMutation.isPending
  };
};
