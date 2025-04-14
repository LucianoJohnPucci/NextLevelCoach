
import { Habit, HabitFrequency, HabitUpdateData } from "../types/habitTypes";

export interface UseHabitsReturn {
  habits: Habit[];
  isLoading: boolean;
  addHabit: (
    title: string,
    frequency: HabitFrequency,
    oldHabit?: string,
    newHabit?: string,
    rating?: number
  ) => Promise<boolean>;
  removeHabit: (id: string) => Promise<void>;
  updateHabit: (id: string, updates: HabitUpdateData) => Promise<boolean>;
}
