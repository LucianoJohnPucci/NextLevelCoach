
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useTasks } from "@/components/tasks/useTasks";

export interface ProgressReportData {
  timeframeDays: number;
  mindMetrics: {
    averageMood: number;
    moodTrend: string;
    meditationMinutes: number;
    journalEntries: number;
  };
  bodyMetrics: {
    averageEnergy: number;
    energyTrend: string;
    workoutsCompleted: number;
    waterIntake: number;
  };
  soulMetrics: {
    reflectionMinutes: number;
    connectionsAttended: number;
    gratitudeStreak: number;
  };
  taskMetrics: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  };
  goalsProgress: {
    mindProgress: number;
    bodyProgress: number;
    soulProgress: number;
    overallProgress: number;
  };
}

export const useProgressReport = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [isLoading, setIsLoading] = useState(false);

  const generateReportData = async (timeframeDays: number): Promise<ProgressReportData> => {
    if (!user) throw new Error("User not authenticated");

    setIsLoading(true);
    
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframeDays);

      // Fetch mind metrics data
      const { data: mindMetrics } = await supabase
        .from("mind_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(timeframeDays);

      // Fetch body metrics data
      const { data: bodyMetrics } = await supabase
        .from("body_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(timeframeDays);

      // Fetch soul metrics data
      const { data: soulMetrics } = await supabase
        .from("soul_metrics")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(timeframeDays);

      // Fetch daily entries for mood and energy data
      const { data: dailyEntries } = await supabase
        .from("daily_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(timeframeDays);

      // Fetch goals for progress calculation
      const { data: mindGoals } = await supabase
        .from("mind_goals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const { data: bodyGoals } = await supabase
        .from("body_goals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const { data: soulGoals } = await supabase
        .from("soul_goals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Calculate aggregated metrics
      const totalMeditationMinutes = mindMetrics?.reduce((sum, entry) => sum + entry.meditation_minutes, 0) || 0;
      const totalWorkoutMinutes = bodyMetrics?.reduce((sum, entry) => sum + entry.workout_minutes, 0) || 0;
      const totalReflectionMinutes = soulMetrics?.reduce((sum, entry) => sum + entry.reflection_minutes, 0) || 0;
      const totalConnectionsAttended = soulMetrics?.reduce((sum, entry) => sum + entry.connections_attended, 0) || 0;
      const maxGratitudeStreak = soulMetrics?.reduce((max, entry) => Math.max(max, entry.gratitude_streak_days), 0) || 0;

      // Calculate mood and energy averages
      const avgMood = dailyEntries?.length ? 
        dailyEntries.reduce((sum, entry) => sum + entry.mood, 0) / dailyEntries.length : 7.8;
      const avgEnergy = dailyEntries?.length ? 
        dailyEntries.reduce((sum, entry) => sum + entry.energy, 0) / dailyEntries.length : 7.0;

      // Calculate task metrics
      const completedTasks = tasks.filter(task => task.completed).length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Calculate progress averages
      const mindProgress = calculateAverageProgress(mindGoals);
      const bodyProgress = calculateAverageProgress(bodyGoals);
      const soulProgress = calculateAverageProgress(soulGoals);
      const overallProgress = Math.round((mindProgress + bodyProgress + soulProgress) / 3);

      const reportData: ProgressReportData = {
        timeframeDays,
        mindMetrics: {
          averageMood: Math.round(avgMood * 10) / 10, // Round to 1 decimal
          moodTrend: "12% increase", // Sample trend - could be calculated from historical data
          meditationMinutes: totalMeditationMinutes,
          journalEntries: dailyEntries?.length || 0,
        },
        bodyMetrics: {
          averageEnergy: Math.round(avgEnergy * 10) / 10, // Round to 1 decimal
          energyTrend: "5% increase", // Sample trend - could be calculated from historical data
          workoutsCompleted: bodyMetrics?.length || 0,
          waterIntake: 0, // Default value - water intake tracking not implemented yet
        },
        soulMetrics: {
          reflectionMinutes: totalReflectionMinutes,
          connectionsAttended: totalConnectionsAttended,
          gratitudeStreak: maxGratitudeStreak,
        },
        taskMetrics: {
          totalTasks,
          completedTasks,
          completionRate,
        },
        goalsProgress: {
          mindProgress,
          bodyProgress,
          soulProgress,
          overallProgress,
        },
      };

      return reportData;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateReportData, isLoading };
};

// Helper function to calculate average progress
const calculateAverageProgress = (goalsObj: any) => {
  if (!goalsObj) return 0;
  
  const excludeProps = ['id', 'user_id', 'created_at', 'updated_at'];
  
  let total = 0;
  let count = 0;
  
  for (const key in goalsObj) {
    if (!excludeProps.includes(key) && typeof goalsObj[key] === 'number') {
      total += goalsObj[key];
      count++;
    }
  }
  
  return count > 0 ? Math.round(total / count) : 0;
};
