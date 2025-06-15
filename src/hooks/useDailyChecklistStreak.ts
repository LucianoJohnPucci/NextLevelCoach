
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  icon: string;
}

export const useDailyChecklistStreak = () => {
  const { user } = useAuth();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [todayProgress, setTodayProgress] = useState({ completed: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    calculateStreak();
  }, [user]);

  const calculateStreak = () => {
    try {
      // Get checklist completion history from localStorage
      const today = new Date().toISOString().split('T')[0];
      const checklistHistory = JSON.parse(localStorage.getItem(`checklistHistory_${user?.id}`) || '{}');
      const currentItems = JSON.parse(localStorage.getItem('dailyChecklistItems') || '[]') as ChecklistItem[];

      // Calculate today's progress
      const completedToday = currentItems.filter(item => item.completed).length;
      const totalItems = currentItems.length;
      setTodayProgress({ completed: completedToday, total: totalItems });

      // Update today's completion status in history
      const todayCompletionRate = totalItems > 0 ? completedToday / totalItems : 0;
      const todayCompleted = todayCompletionRate >= 0.75; // 75% completion threshold
      
      const updatedHistory = {
        ...checklistHistory,
        [today]: { completed: todayCompleted, completionRate: todayCompletionRate }
      };
      localStorage.setItem(`checklistHistory_${user?.id}`, JSON.stringify(updatedHistory));

      // Calculate current streak
      let streak = 0;
      let date = new Date();
      
      while (true) {
        const dateStr = date.toISOString().split('T')[0];
        const dayData = updatedHistory[dateStr];
        
        if (dayData && dayData.completed) {
          streak++;
          date.setDate(date.getDate() - 1);
        } else if (dateStr === today && !todayCompleted) {
          // Today hasn't been completed yet, but don't break the streak
          date.setDate(date.getDate() - 1);
        } else {
          break;
        }
      }

      setCurrentStreak(streak);

      // Calculate longest streak
      const dates = Object.keys(updatedHistory).sort();
      let maxStreak = 0;
      let tempStreak = 0;

      for (const dateStr of dates) {
        if (updatedHistory[dateStr].completed) {
          tempStreak++;
          maxStreak = Math.max(maxStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      setLongestStreak(Math.max(maxStreak, streak));
    } catch (error) {
      console.error('Error calculating checklist streak:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Recalculate when items change
  useEffect(() => {
    const handleStorageChange = () => {
      calculateStreak();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events when checklist items are updated
    window.addEventListener('checklistUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('checklistUpdated', handleStorageChange);
    };
  }, [user]);

  return {
    currentStreak,
    longestStreak,
    todayProgress,
    isLoading,
    refreshStreak: calculateStreak
  };
};
