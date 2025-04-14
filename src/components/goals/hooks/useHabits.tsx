
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Habit } from "../types/habitTypes";
import { UseHabitsReturn } from "./types";
import { fetchHabits, addHabit, removeHabit, updateHabit } from "./habitsActions";

export const useHabits = (): UseHabitsReturn => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load habits when the component mounts
  useEffect(() => {
    const loadHabits = async () => {
      setIsLoading(true);
      try {
        await fetchHabits(user?.id || null, setHabits);
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
      const success = await addHabit(
        user?.id,
        title,
        frequency,
        setHabits,
        toast,
        oldHabit,
        newHabit,
        rating
      );
      return success;
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
      await removeHabit(id, user?.id, setHabits, toast);
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
      const success = await updateHabit(id, updates, user?.id, setHabits, toast);
      return success;
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

  return {
    habits,
    isLoading,
    addHabit: handleAddHabit,
    removeHabit: handleRemoveHabit,
    updateHabit: handleUpdateHabit,
  };
};
