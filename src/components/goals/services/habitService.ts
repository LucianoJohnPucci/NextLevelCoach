import { supabase } from "@/integrations/supabase/client";
import { Habit, HabitFrequency, HabitUpdateData } from "../types/habitTypes";

/**
 * Fetch habits from Supabase
 */
export const fetchHabitsFromSupabase = async (): Promise<Habit[]> => {
  const { data, error } = await supabase
    .rpc('get_habits')
    .order('created_at', { ascending: false }) as any;

  if (error) {
    console.error("Error fetching habits:", error);
    throw error;
  }

  if (!data) return [];

  return data.map((habit: any) => ({
    id: habit.id,
    title: habit.title,
    old_habit: habit.old_habit || undefined,
    new_habit: habit.new_habit || undefined,
    frequency: habit.frequency as HabitFrequency,
    rating: habit.rating || undefined,
    created_at: new Date(habit.created_at),
  }));
};

/**
 * Add a new habit to Supabase
 */
export const addHabitToSupabase = async (
  userId: string,
  title: string,
  frequency: HabitFrequency,
  oldHabit?: string,
  newHabit?: string,
  rating?: number
): Promise<void> => {
  const { error } = await supabase.rpc('add_habit', {
    p_title: title,
    p_user_id: userId,
    p_old_habit: oldHabit,
    p_new_habit: newHabit,
    p_frequency: frequency,
    p_rating: rating
  }) as any;

  if (error) {
    console.error("Error adding habit:", error);
    throw error;
  }
};

/**
 * Remove a habit from Supabase
 */
export const removeHabitFromSupabase = async (id: string): Promise<void> => {
  const { error } = await supabase.rpc('delete_habit', { p_id: id }) as any;

  if (error) {
    console.error("Error removing habit:", error);
    throw error;
  }
};

/**
 * Update a habit in Supabase
 */
export const updateHabitInSupabase = async (id: string, updates: HabitUpdateData): Promise<void> => {
  const { error } = await supabase.rpc('update_habit', {
    p_id: id,
    p_title: updates.title,
    p_frequency: updates.frequency,
    p_old_habit: updates.old_habit,
    p_new_habit: updates.new_habit,
    p_rating: updates.rating
  }) as any;

  if (error) {
    console.error("Error updating habit:", error);
    throw error;
  }
};

/**
 * Get habits with tracking data and streaks
 */
export const fetchHabitsWithTracking = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .rpc('get_habit_tracking_with_streaks') as any;

  if (error) {
    console.error("Error fetching habits with tracking:", error);
    throw error;
  }

  if (!data) return [];

  return data.map((habit: any) => ({
    id: habit.habit_id,
    title: habit.habit_title,
    old_habit: habit.habit_old_habit || undefined,
    new_habit: habit.habit_new_habit || undefined,
    frequency: habit.habit_frequency as HabitFrequency,
    rating: habit.habit_rating || undefined,
    created_at: new Date(),
    current_streak: habit.current_streak || 0,
    today_completed: habit.today_completed || false,
    today_avoided_old_habit: habit.today_avoided_old_habit,
    today_practiced_new_habit: habit.today_practiced_new_habit,
    completion_rate: habit.completion_rate || 0,
  }));
};

/**
 * Track habit progress for a specific date
 */
export const trackHabitProgress = async (
  habitId: string,
  completed: boolean,
  avoidedOldHabit?: boolean,
  practicedNewHabit?: boolean,
  notes?: string,
  date?: Date
): Promise<void> => {
  const trackingDate = date ? date.toISOString().split('T')[0] : undefined;
  
  const { error } = await supabase.rpc('track_habit_progress', {
    p_habit_id: habitId,
    p_date: trackingDate,
    p_completed: completed,
    p_avoided_old_habit: avoidedOldHabit,
    p_practiced_new_habit: practicedNewHabit,
    p_notes: notes
  }) as any;

  if (error) {
    console.error("Error tracking habit progress:", error);
    throw error;
  }
};

/**
 * Get habit streak history
 */
export const getHabitStreakHistory = async (
  habitId: string,
  days: number = 30
): Promise<any[]> => {
  const { data, error } = await supabase.rpc('get_habit_streak_history', {
    p_habit_id: habitId,
    p_days: days
  }) as any;

  if (error) {
    console.error("Error fetching habit streak history:", error);
    throw error;
  }

  return data || [];
};

/**
 * Get default habits for non-authenticated users
 */
export const getDefaultHabits = (): Habit[] => {
  return [
    { id: "1", title: "Morning meditation", frequency: "daily", created_at: new Date() },
    { id: "2", title: "Journal writing", frequency: "daily", created_at: new Date() },
    { id: "3", title: "Yoga session", frequency: "weekly", created_at: new Date() },
    { id: "4", title: "Reading time", frequency: "daily", created_at: new Date() },
  ];
};

/**
 * Load habits from localStorage
 */
export const loadHabitsFromLocalStorage = (): Habit[] | null => {
  const savedHabits = localStorage.getItem("userHabits");
  if (!savedHabits) return null;
  
  try {
    const parsed = JSON.parse(savedHabits);
    return parsed.map((habit: any) => ({
      ...habit,
      created_at: new Date(habit.created_at)
    }));
  } catch (e) {
    console.error("Failed to parse saved habits:", e);
    return null;
  }
};

/**
 * Save habits to localStorage
 */
export const saveHabitsToLocalStorage = (habits: Habit[]): void => {
  localStorage.setItem("userHabits", JSON.stringify(habits));
};
