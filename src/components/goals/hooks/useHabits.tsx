
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Habit, HabitFrequency, HabitUpdateData } from "../types/habitTypes";
import {
  fetchHabitsFromSupabase,
  addHabitToSupabase,
  removeHabitFromSupabase,
  updateHabitInSupabase,
  getDefaultHabits,
  loadHabitsFromLocalStorage,
  saveHabitsToLocalStorage
} from "../services/habitService";

export type { Habit } from "../types/habitTypes";

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load habits when the component mounts
  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      // If no user is logged in, try to load from localStorage as fallback
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
  }, [user]);

  // Save habits to localStorage whenever they change (as fallback)
  useEffect(() => {
    if (habits.length > 0 && !user) {
      saveHabitsToLocalStorage(habits);
    }
  }, [habits, user]);

  // Fetch habits from Supabase
  const fetchHabits = async () => {
    if (!user) return;

    try {
      const formattedHabits = await fetchHabitsFromSupabase();
      setHabits(formattedHabits);
    } catch (error) {
      console.error("Error in fetchHabits:", error);
      toast({
        title: "Error fetching habits",
        description: "Failed to load your habits. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to add a new habit
  const addHabit = async (
    title: string, 
    frequency: HabitFrequency, 
    oldHabit?: string, 
    newHabit?: string, 
    rating?: number
  ) => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit title",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    if (user) {
      // Add to Supabase
      try {
        await addHabitToSupabase(
          user.id,
          title,
          frequency,
          oldHabit,
          newHabit,
          rating
        );

        // Refresh habits after adding
        fetchHabits();
        
        toast({
          title: "Habit Added",
          description: `"${title}" has been added to your habits.`,
        });
      } catch (error) {
        console.error("Error in addHabit:", error);
        toast({
          title: "Error",
          description: "Failed to add habit. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } else {
      // Add to local state if no user
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
    }

    setIsLoading(false);
    return true;
  };

  // Function to remove a habit
  const removeHabit = async (id: string) => {
    if (user) {
      // Remove from Supabase
      try {
        await removeHabitFromSupabase(id);

        // Update local state
        setHabits(prev => prev.filter(habit => habit.id !== id));
        
        toast({
          title: "Habit Removed",
          description: "The habit has been removed from your list.",
        });
      } catch (error) {
        console.error("Error in removeHabit:", error);
        toast({
          title: "Error removing habit",
          description: "Failed to remove habit. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Remove from local state
      setHabits(prev => prev.filter(habit => habit.id !== id));
      
      toast({
        title: "Habit Removed",
        description: "The habit has been removed from your list.",
      });
    }
  };

  // Function to update a habit
  const updateHabit = async (id: string, updates: HabitUpdateData) => {
    if (user) {
      try {
        await updateHabitInSupabase(id, updates);

        // Refresh habits after updating
        fetchHabits();
        
        toast({
          title: "Habit Updated",
          description: "Your habit has been updated.",
        });
        return true;
      } catch (error) {
        console.error("Error in updateHabit:", error);
        toast({
          title: "Error updating habit",
          description: "Failed to update habit. Please try again.",
          variant: "destructive",
        });
        return false;
      }
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
  };

  return {
    habits,
    isLoading,
    addHabit,
    removeHabit,
    updateHabit
  };
};
