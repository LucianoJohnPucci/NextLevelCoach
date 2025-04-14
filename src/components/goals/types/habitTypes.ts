
// Define habit-related types
export interface Habit {
  id: string;
  title: string;
  old_habit?: string;
  new_habit?: string;
  frequency: "daily" | "weekly" | "monthly";
  rating?: number;
  created_at: Date;
}

export type HabitFrequency = "daily" | "weekly" | "monthly";

export interface HabitFormData {
  title: string;
  frequency: HabitFrequency;
  old_habit?: string;
  new_habit?: string;
  rating?: number;
}

export interface HabitUpdateData {
  title?: string;
  frequency?: HabitFrequency;
  old_habit?: string;
  new_habit?: string;
  rating?: number;
}
