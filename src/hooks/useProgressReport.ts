
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

      // Fetch mind metrics
      const { data: mindGoals } = await supabase
        .from("mind_goals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Fetch body metrics
      const { data: bodyGoals } = await supabase
        .from("body_goals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Fetch soul metrics
      const { data: soulGoals } = await supabase
        .from("soul_goals")
        .select("*")
        .eq("user_id", user.id)
        .single();

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
          averageMood: 7.8, // Sample data - in real app this would come from daily entries
          moodTrend: "12% increase",
          meditationMinutes: mindGoals?.meditation_minutes || 0,
          journalEntries: mindGoals?.journal_entries || 0,
        },
        bodyMetrics: {
          averageEnergy: 7.0,
          energyTrend: "5% increase",
          workoutsCompleted: bodyGoals?.workouts_completed || 0,
          waterIntake: bodyGoals?.water_intake || 0,
        },
        soulMetrics: {
          reflectionMinutes: soulGoals?.reflection_minutes || 0,
          connectionsAttended: soulGoals?.connections_attended || 0,
          gratitudeStreak: soulGoals?.gratitude_streak_days || 0,
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
