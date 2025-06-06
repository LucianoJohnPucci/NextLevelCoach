
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Habit } from "../types/habitTypes";
import { UseHabitsReturn } from "./types";
import { 
  fetchHabitsWithTracking,
  trackHabitProgress,
  addHabitToSupabase, 
  removeHabitFromSupabase, 
  updateHabitInSupabase,
  getDefaultHabits,
  loadHabitsFromLocalStorage,
  saveHabitsToLocalStorage
} from "../services/habitService";

export const useHabits = (): UseHabitsReturn & {
  trackProgress: (habitId: string, completed: boolean, avoidedOld?: boolean, practicedNew?: boolean, notes?: string) => Promise<void>;
} => {
  const [habits, setHabits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load habits when the component mounts
  useEffect(() => {
    const loadHabits = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // Fetch from Supabase with tracking data
          const habitsWithTracking = await fetchHabitsWithTracking();
          setHabits(habitsWithTracking);
        } else {
          // Fetch from localStorage
          const savedHabits = loadHabitsFromLocalStorage();
          if (savedHabits) {
            setHabits(savedHabits);
          } else {
            // Set default habits if none exist
            const defaultHabits = getDefaultHabits();
            setHabits(defaultHabits);
            saveHabitsToLocalStorage(defaultHabits);
          }
        }
      } catch (error) {
        console.error("Error loading habits:", error);
        toast({
          title: "Error",
          description: "Failed to load habits. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHabits();
  }, [user, toast]);

  // Handle adding a new habit
  const handleAddHabit = async (
    title: string,
    frequency: "daily" | "weekly" | "monthly",
    oldHabit?: string,
    newHabit?: string,
    rating?: number
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (user) {
        await addHabitToSupabase(user.id, title, frequency, oldHabit, newHabit, rating);
        
        // Refresh habits with tracking data
        const habitsWithTracking = await fetchHabitsWithTracking();
        setHabits(habitsWithTracking);
        
        toast({
          title: "Habit Added",
          description: `"${title}" has been added to your habits.`,
        });
        
        return true;
      } else {
        // Add to local state
        const newHabitObj = {
          id: Date.now().toString(),
          title,
          old_habit: oldHabit,
          new_habit: newHabit,
          frequency,
          rating,
          created_at: new Date(),
        };
        
        setHabits(prev => [...prev, newHabitObj]);
        
        toast({
          title: "Habit Added",
          description: `"${title}" has been added to your habits.`,
        });
        
        return true;
      }
    } catch (error) {
      console.error("Error adding habit:", error);
      toast({
        title: "Error",
        description: "Failed to add habit. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing a habit
  const handleRemoveHabit = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      if (user) {
        await removeHabitFromSupabase(id);
        
        // Update local state
        setHabits(prev => prev.filter(habit => habit.id !== id));
        
        toast({
          title: "Habit Removed",
          description: "The habit has been removed from your list.",
        });
      } else {
        // Remove from local state
        setHabits(prev => prev.filter(habit => habit.id !== id));
        
        toast({
          title: "Habit Removed",
          description: "The habit has been removed from your list.",
        });
      }
    } catch (error) {
      console.error("Error removing habit:", error);
      toast({
        title: "Error",
        description: "Failed to remove habit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating a habit
  const handleUpdateHabit = async (
    id: string,
    updates: any
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (user) {
        await updateHabitInSupabase(id, updates);
        
        // Refresh habits with tracking data
        const habitsWithTracking = await fetchHabitsWithTracking();
        setHabits(habitsWithTracking);
        
        toast({
          title: "Habit Updated",
          description: "Your habit has been updated.",
        });
        
        return true;
      } else {
        // Update in local state
        setHabits(prev => 
          prev.map(habit => 
            habit.id === id ? {...habit, ...updates} : habit
          )
        );
        
        toast({
          title: "Habit Updated",
          description: "Your habit has been updated.",
        });
        
        return true;
      }
    } catch (error) {
      console.error("Error updating habit:", error);
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tracking habit progress
  const handleTrackProgress = async (
    habitId: string,
    completed: boolean,
    avoidedOld?: boolean,
    practicedNew?: boolean,
    notes?: string
  ): Promise<void> => {
    try {
      if (user) {
        await trackHabitProgress(habitId, completed, avoidedOld, practicedNew, notes);
        
        // Refresh habits with updated tracking data
        const habitsWithTracking = await fetchHabitsWithTracking();
        setHabits(habitsWithTracking);
        
        toast({
          title: "Progress Tracked",
          description: completed ? "Great job! Keep up the streak! 🔥" : "Progress updated successfully.",
        });
      } else {
        // For non-authenticated users, just update completion status locally
        setHabits(prev => 
          prev.map(habit => 
            habit.id === habitId ? {...habit, today_completed: completed} : habit
          )
        );
        
        toast({
          title: "Progress Tracked",
          description: completed ? "Great job! Keep going! 🔥" : "Progress updated.",
        });
      }
    } catch (error) {
      console.error("Error tracking progress:", error);
      toast({
        title: "Error",
        description: "Failed to track progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    habits,
    isLoading,
    addHabit: handleAddHabit,
    removeHabit: handleRemoveHabit,
    updateHabit: handleUpdateHabit,
    trackProgress: handleTrackProgress,
  };
};
