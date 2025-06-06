
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { DailyGoal } from "@/pages/GoalsPage";

export const useDailyGoals = () => {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch daily goals from Supabase for today
  const fetchDailyGoals = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const { data, error } = await supabase
        .from("daily_goals")
        .select("*")
        .eq("date", today)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching daily goals:", error);
        toast({
          title: "Error fetching goals",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const formattedGoals: DailyGoal[] = data.map(goal => ({
          id: goal.id,
          title: goal.title,
          category: goal.category as "mind" | "body" | "soul",
          startTime: goal.start_time || "",
          duration: goal.duration,
          completed: goal.completed,
          added: new Date(goal.created_at),
        }));
        setGoals(formattedGoals);
      }
    } catch (error) {
      console.error("Error in fetchDailyGoals:", error);
    }
  };

  // Load goals when the component mounts
  useEffect(() => {
    if (user) {
      fetchDailyGoals();
    } else {
      // If no user is logged in, try to load from localStorage as fallback
      const savedGoals = localStorage.getItem("dailyGoals");
      if (savedGoals) {
        try {
          const parsed = JSON.parse(savedGoals);
          setGoals(parsed.map((goal: any) => ({
            ...goal,
            added: new Date(goal.added)
          })));
        } catch (e) {
          console.error("Failed to parse saved daily goals:", e);
        }
      }
    }
  }, [user]);

  // Save goals to localStorage whenever they change (as fallback)
  useEffect(() => {
    if (goals.length > 0 && !user) {
      localStorage.setItem("dailyGoals", JSON.stringify(goals));
    }
  }, [goals, user]);

  // Function to add a new daily goal
  const addGoal = async (
    title: string, 
    category: "mind" | "body" | "soul", 
    startTime: string, 
    duration: number
  ) => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive",
      });
      return false;
    }

    if (goals.length >= 3) {
      toast({
        title: "Goal limit reached",
        description: "You can only have 3 goals per day. Complete or remove one to add another.",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    if (user) {
      // Add to Supabase
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from("daily_goals")
          .insert([
            {
              title,
              category,
              start_time: startTime || null,
              duration,
              user_id: user.id,
              date: today,
            }
          ])
          .select();

        if (error) {
          console.error("Error adding daily goal:", error);
          toast({
            title: "Error adding goal",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return false;
        }

        // Refresh goals after adding
        await fetchDailyGoals();
        
        toast({
          title: "Goal Added",
          description: `"${title}" has been added to today's goals.`,
        });
      } catch (error) {
        console.error("Error in addGoal:", error);
        toast({
          title: "Error",
          description: "Failed to add goal. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } else {
      // Add to local state if no user
      const newGoal: DailyGoal = {
        id: Date.now().toString(),
        title,
        category,
        startTime,
        duration,
        completed: false,
        added: new Date(),
      };
      
      setGoals(prev => [...prev, newGoal]);
      
      toast({
        title: "Goal Added",
        description: `"${title}" has been added to today's goals.`,
      });
    }

    setIsLoading(false);
    return true;
  };

  // Function to remove a daily goal
  const removeGoal = async (id: string) => {
    if (user) {
      // Remove from Supabase
      try {
        const { error } = await supabase
          .from("daily_goals")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error removing daily goal:", error);
          toast({
            title: "Error removing goal",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Update local state
        setGoals(prev => prev.filter(goal => goal.id !== id));
        
        toast({
          title: "Goal Removed",
          description: "The goal has been removed from today's list.",
        });
      } catch (error) {
        console.error("Error in removeGoal:", error);
      }
    } else {
      // Remove from local state
      setGoals(prev => prev.filter(goal => goal.id !== id));
      
      toast({
        title: "Goal Removed",
        description: "The goal has been removed from today's list.",
      });
    }
  };

  // Function to toggle goal completion
  const toggleGoalCompletion = async (id: string) => {
    if (user) {
      try {
        const goal = goals.find(g => g.id === id);
        if (!goal) return;

        const { error } = await supabase
          .from("daily_goals")
          .update({ completed: !goal.completed })
          .eq("id", id);

        if (error) {
          console.error("Error updating goal completion:", error);
          toast({
            title: "Error updating goal",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Update local state
        setGoals(prev => 
          prev.map(g => 
            g.id === id ? {...g, completed: !g.completed} : g
          )
        );

        toast({
          title: goal.completed ? "Goal marked incomplete" : "Goal completed!",
          description: goal.completed ? "Goal marked as incomplete." : "Great job completing your goal!",
        });
      } catch (error) {
        console.error("Error in toggleGoalCompletion:", error);
      }
    } else {
      // Update local state
      setGoals(prev => 
        prev.map(g => 
          g.id === id ? {...g, completed: !g.completed} : g
        )
      );
    }
  };

  // Function to update goal details
  const updateGoal = async (id: string, updates: Partial<DailyGoal>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("daily_goals")
          .update({
            title: updates.title,
            category: updates.category,
            start_time: updates.startTime || null,
            duration: updates.duration,
          })
          .eq("id", id);

        if (error) {
          console.error("Error updating goal:", error);
          toast({
            title: "Error updating goal",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        // Update local state
        setGoals(prev => 
          prev.map(g => 
            g.id === id ? {...g, ...updates} : g
          )
        );

        toast({
          title: "Goal Updated",
          description: "Your goal has been updated successfully.",
        });
      } catch (error) {
        console.error("Error in updateGoal:", error);
      }
    } else {
      // Update local state
      setGoals(prev => 
        prev.map(g => 
          g.id === id ? {...g, ...updates} : g
        )
      );
    }
  };

  return {
    goals,
    isLoading,
    addGoal,
    removeGoal,
    toggleGoalCompletion,
    updateGoal,
  };
};
