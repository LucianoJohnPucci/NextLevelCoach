import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface ProgressReportData {
  timeframeDays: number;
  mindMetrics: {
    averageMood: number;
    meditationMinutes: number;
    journalEntries: number;
  };
  bodyMetrics: {
    averageEnergy: number;
    workoutsCompleted: number;
  };
  soulMetrics: {
    reflectionMinutes: number;
    connectionsAttended: number;
    gratitudeStreak: number;
  };
  taskMetrics: {
    completionRate: number;
  };
  goalsProgress: {
    overallProgress: number;
  };
  timeframeGoals: any[];
  timeframeHabits: any[];
  emotionDistribution: { [emotion: string]: number };
}

export const useProgressReport = () => {
  const { user } = useAuth();

  const generateReportData = async (timeframeDays: number): Promise<ProgressReportData> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - timeframeDays);

    // Helper function to format date for Supabase queries
    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };

    const startDateStr = formatDate(startDate);
    const todayStr = formatDate(today);

    // Fetch mood and journal entries for the specified timeframe
    const fetchMindMetrics = async () => {
      const { data: dailyEntries, error: dailyError } = await supabase
        .from('daily_entries')
        .select('mood')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', todayStr);

      if (dailyError) {
        console.error("Error fetching daily entries:", dailyError);
        return { averageMood: 5 };
      }

      const totalMood = dailyEntries.reduce((sum, entry) => sum + entry.mood, 0);
      const averageMood = dailyEntries.length > 0 ? Math.round(totalMood / dailyEntries.length) : 5;

      const { count: journalEntries, error: journalError } = await supabase
        .from('journal_entries')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .gte('created_at', startDateStr)
        .lte('created_at', todayStr);

      if (journalError) {
        console.error("Error fetching journal entries:", journalError);
        return { averageMood, journalEntries: 0, meditationMinutes: 0 };
      }

      // Mock meditation minutes
      const meditationMinutes = Math.floor(Math.random() * 60) + 10;

      return { averageMood, journalEntries: journalEntries || 0, meditationMinutes };
    };

    // Fetch energy levels and workout data for the specified timeframe
    const fetchBodyMetrics = async () => {
      const { data: dailyEntries, error: dailyError } = await supabase
        .from('daily_entries')
        .select('energy')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', todayStr);

      if (dailyError) {
        console.error("Error fetching daily entries:", dailyError);
        return { averageEnergy: 5, workoutsCompleted: 0 };
      }

      const totalEnergy = dailyEntries.reduce((sum, entry) => sum + entry.energy, 0);
      const averageEnergy = dailyEntries.length > 0 ? Math.round(totalEnergy / dailyEntries.length) : 5;

      // Mock workout data
      const workoutsCompleted = Math.floor(Math.random() * 7);

      return { averageEnergy, workoutsCompleted };
    };

    // Fetch reflection minutes, connections attended, and gratitude streak for the specified timeframe
    const fetchSoulMetrics = async () => {
      const { data: dailyEntries, error: dailyError } = await supabase
        .from('daily_entries')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', todayStr);

      if (dailyError) {
        console.error("Error fetching daily entries:", dailyError);
        return { reflectionMinutes: 0, connectionsAttended: 0, gratitudeStreak: 0 };
      }

      // Mock reflection minutes, connections attended, and gratitude streak
      const reflectionMinutes = Math.floor(Math.random() * 90) + 30;
      const connectionsAttended = Math.floor(Math.random() * 5);
      const gratitudeStreak = Math.floor(Math.random() * 14);

      return { reflectionMinutes, connectionsAttended, gratitudeStreak };
    };

    // Fetch task completion rate for the specified timeframe
    const fetchTaskMetrics = async () => {
      // Mock task completion rate
      const completionRate = Math.floor(Math.random() * 40) + 60;
      return { completionRate };
    };

    // Fetch goals and calculate overall progress
    const fetchGoalsProgress = async () => {
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('progress')
        .eq('user_id', user.id);

      if (goalsError) {
        console.error("Error fetching goals:", goalsError);
        return { overallProgress: 50 };
      }

      const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
      const overallProgress = goals.length > 0 ? Math.round(totalProgress / goals.length) : 50;

      return { overallProgress };
    };

    const fetchTimeframeGoals = async () => {
      const { data, error } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', todayStr);

      if (error) {
        console.error("Error fetching timeframe goals:", error);
        return [];
      }

      return data || [];
    };

    const fetchTimeframeHabits = async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching timeframe habits:", error);
        return [];
      }

      return data || [];
    };

    const fetchEmotionDistribution = async () => {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('emotions')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', todayStr);

      if (error) {
        console.error("Error fetching emotion distribution:", error);
        return {};
      }

      const emotionCounts: { [emotion: string]: number } = {};
      data.forEach(entry => {
        if (entry.emotions && Array.isArray(entry.emotions)) {
          entry.emotions.forEach(emotion => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
          });
        }
      });

      // Convert counts to percentages
      const totalEntries = data.length;
      const emotionPercentages: { [emotion: string]: number } = {};
      for (const emotion in emotionCounts) {
        emotionPercentages[emotion] = totalEntries > 0 ? Math.round((emotionCounts[emotion] / totalEntries) * 100) : 0;
      }

      return emotionPercentages;
    };

    const [
      mindMetrics,
      bodyMetrics,
      soulMetrics,
      taskMetrics,
      goalsProgress,
      timeframeGoals,
      timeframeHabits,
      emotionDistribution
    ] = await Promise.all([
      fetchMindMetrics(),
      fetchBodyMetrics(),
      fetchSoulMetrics(),
      fetchTaskMetrics(),
      fetchGoalsProgress(),
      fetchTimeframeGoals(),
      fetchTimeframeHabits(),
      fetchEmotionDistribution()
    ]);

    return {
      timeframeDays,
      mindMetrics,
      bodyMetrics,
      soulMetrics,
      taskMetrics,
      goalsProgress,
      timeframeGoals,
      timeframeHabits,
      emotionDistribution
    };
  };

  return { generateReportData };
};
