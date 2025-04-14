
import { Dispatch, SetStateAction } from "react";
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

// Fetch habits
export const fetchHabits = async (
  userId: string | null,
  setHabits: Dispatch<SetStateAction<Habit[]>>
): Promise<void> => {
  if (userId) {
    // Fetch from Supabase
    const formattedHabits = await fetchHabitsFromSupabase();
    setHabits(formattedHabits);
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
};

// Add a habit
export const addHabit = async (
  userId: string | undefined,
  title: string,
  frequency: HabitFrequency,
  setHabits: Dispatch<SetStateAction<Habit[]>>,
  toast: any,
  oldHabit?: string,
  newHabit?: string,
  rating?: number
): Promise<boolean> => {
  if (userId) {
    // Add to Supabase
    try {
      await addHabitToSupabase(
        userId,
        title,
        frequency,
        oldHabit,
        newHabit,
        rating
      );
      
      toast({
        title: "Habit Added",
        description: `"${title}" has been added to your habits.`,
      });
      
      return true;
    } catch (error) {
      throw error;
    }
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
};

// Remove a habit
export const removeHabit = async (
  id: string,
  userId: string | undefined,
  setHabits: Dispatch<SetStateAction<Habit[]>>,
  toast: any
): Promise<void> => {
  if (userId) {
    // Remove from Supabase
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
};

// Update a habit
export const updateHabit = async (
  id: string,
  updates: HabitUpdateData,
  userId: string | undefined,
  setHabits: Dispatch<SetStateAction<Habit[]>>,
  toast: any
): Promise<boolean> => {
  if (userId) {
    await updateHabitInSupabase(id, updates);
    
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
};
