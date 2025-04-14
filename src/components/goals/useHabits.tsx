
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export interface Habit {
  id: string;
  title: string;
  old_habit?: string;
  new_habit?: string;
  frequency: "daily" | "weekly" | "monthly";
  rating?: number;
  created_at: Date;
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch habits from Supabase
  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_habits')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching habits:", error);
        toast({
          title: "Error fetching habits",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const formattedHabits: Habit[] = data.map((habit: any) => ({
          id: habit.id,
          title: habit.title,
          old_habit: habit.old_habit || undefined,
          new_habit: habit.new_habit || undefined,
          frequency: habit.frequency as "daily" | "weekly" | "monthly",
          rating: habit.rating || undefined,
          created_at: new Date(habit.created_at),
        }));
        setHabits(formattedHabits);
      }
    } catch (error) {
      console.error("Error in fetchHabits:", error);
    }
  };

  // Load habits when the component mounts
  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      // If no user is logged in, try to load from localStorage as fallback
      const savedHabits = localStorage.getItem("userHabits");
      if (savedHabits) {
        try {
          setHabits(JSON.parse(savedHabits));
        } catch (e) {
          console.error("Failed to parse saved habits:", e);
        }
      } else {
        // Set default habits if none exist
        const defaultHabits = [
          { id: "1", title: "Morning meditation", frequency: "daily" as const, created_at: new Date() },
          { id: "2", title: "Journal writing", frequency: "daily" as const, created_at: new Date() },
          { id: "3", title: "Yoga session", frequency: "weekly" as const, created_at: new Date() },
          { id: "4", title: "Reading time", frequency: "daily" as const, created_at: new Date() },
        ];
        setHabits(defaultHabits);
        localStorage.setItem("userHabits", JSON.stringify(defaultHabits));
      }
    }
  }, [user]);

  // Save habits to localStorage whenever they change (as fallback)
  useEffect(() => {
    if (habits.length > 0 && !user) {
      localStorage.setItem("userHabits", JSON.stringify(habits));
    }
  }, [habits, user]);

  // Function to add a new habit
  const addHabit = async (
    title: string, 
    frequency: "daily" | "weekly" | "monthly", 
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
        const { error } = await supabase.rpc('add_habit', {
          p_title: title,
          p_user_id: user.id,
          p_old_habit: oldHabit,
          p_new_habit: newHabit,
          p_frequency: frequency,
          p_rating: rating
        });

        if (error) {
          console.error("Error adding habit:", error);
          toast({
            title: "Error adding habit",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }

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
        const { error } = await supabase.rpc('delete_habit', { p_id: id });

        if (error) {
          console.error("Error removing habit:", error);
          toast({
            title: "Error removing habit",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Update local state
        setHabits(prev => prev.filter(habit => habit.id !== id));
        
        toast({
          title: "Habit Removed",
          description: "The habit has been removed from your list.",
        });
      } catch (error) {
        console.error("Error in removeHabit:", error);
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
  const updateHabit = async (
    id: string, 
    updates: {
      title?: string;
      frequency?: "daily" | "weekly" | "monthly";
      old_habit?: string;
      new_habit?: string;
      rating?: number;
    }
  ) => {
    if (user) {
      try {
        const { error } = await supabase.rpc('update_habit', {
          p_id: id,
          p_title: updates.title,
          p_frequency: updates.frequency,
          p_old_habit: updates.old_habit,
          p_new_habit: updates.new_habit,
          p_rating: updates.rating
        });

        if (error) {
          console.error("Error updating habit:", error);
          toast({
            title: "Error updating habit",
            description: error.message,
            variant: "destructive",
          });
          return false;
        }

        // Refresh habits after updating
        fetchHabits();
        
        toast({
          title: "Habit Updated",
          description: "Your habit has been updated.",
        });
        return true;
      } catch (error) {
        console.error("Error in updateHabit:", error);
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
