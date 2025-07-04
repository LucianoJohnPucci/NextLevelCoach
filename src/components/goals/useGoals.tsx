
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Goal } from "@/types/goals";

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch goals from Supabase
  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching goals:", error);
        toast({
          title: "Error fetching goals",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const formattedGoals: Goal[] = data.map(goal => ({
          id: goal.id,
          title: goal.title,
          progress: goal.progress || 0,
          added: new Date(goal.created_at),
          start_date: goal.start_date ? new Date(goal.start_date) : undefined,
          milestone_date: goal.milestone_date ? new Date(goal.milestone_date) : undefined,
          final_date: goal.final_date ? new Date(goal.final_date) : undefined,
          why: goal.why || undefined,
        }));
        setGoals(formattedGoals);
      }
    } catch (error) {
      console.error("Error in fetchGoals:", error);
    }
  };

  // Load goals when the component mounts
  useEffect(() => {
    if (user) {
      fetchGoals();
    } else {
      // If no user is logged in, try to load from localStorage as fallback
      const savedGoals = localStorage.getItem("userGoals");
      if (savedGoals) {
        try {
          setGoals(JSON.parse(savedGoals));
        } catch (e) {
          console.error("Failed to parse saved goals:", e);
        }
      } else {
        // Set default goals if none exist
        const defaultGoals = [
          { id: "1", title: "Read 12 books this year", progress: 25, added: new Date() },
          { id: "2", title: "Practice meditation daily", progress: 75, added: new Date() },
          { id: "3", title: "Exercise 3 times weekly", progress: 66, added: new Date() },
        ];
        setGoals(defaultGoals);
        localStorage.setItem("userGoals", JSON.stringify(defaultGoals));
      }
    }
  }, [user]);

  // Save goals to localStorage whenever they change (as fallback)
  useEffect(() => {
    if (goals.length > 0 && !user) {
      localStorage.setItem("userGoals", JSON.stringify(goals));
    }
  }, [goals, user]);

  // Function to add a new goal
  const addGoal = async (title: string, startDate: Date, why?: string, milestoneDate?: Date, finalDate?: Date) => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    if (user) {
      // Add to Supabase
      try {
        const { data, error } = await supabase
          .from("goals")
          .insert([
            {
              title,
              user_id: user.id,
              start_date: startDate.toISOString().split('T')[0],
              milestone_date: milestoneDate ? milestoneDate.toISOString().split('T')[0] : null,
              final_date: finalDate ? finalDate.toISOString().split('T')[0] : null,
              progress: 0,
              why,
            }
          ])
          .select();

        if (error) {
          console.error("Error adding goal:", error);
          toast({
            title: "Error adding goal",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Refresh goals after adding
        fetchGoals();
        
        toast({
          title: "Goal Added",
          description: `"${title}" has been added to your goals.`,
        });
      } catch (error) {
        console.error("Error in addGoal:", error);
        toast({
          title: "Error",
          description: "Failed to add goal. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Add to local state if no user
      const newGoal = {
        id: Date.now().toString(),
        title,
        progress: 0,
        added: new Date(),
        start_date: startDate,
        milestone_date: milestoneDate,
        final_date: finalDate,
        why,
      };
      
      setGoals(prev => [...prev, newGoal]);
      
      toast({
        title: "Goal Added",
        description: `"${title}" has been added to your goals.`,
      });
    }

    setIsLoading(false);
    return true;
  };

  // Function to remove a goal
  const removeGoal = async (id: string) => {
    if (user) {
      // Remove from Supabase
      try {
        const { error } = await supabase
          .from("goals")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error removing goal:", error);
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
          description: "The goal has been removed from your list.",
        });
      } catch (error) {
        console.error("Error in removeGoal:", error);
      }
    } else {
      // Remove from local state
      setGoals(prev => prev.filter(goal => goal.id !== id));
      
      toast({
        title: "Goal Removed",
        description: "The goal has been removed from your list.",
      });
    }
  };

  // Function to update goal progress
  const updateGoalProgress = async (id: string, progress: number) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("goals")
          .update({ progress })
          .eq("id", id);

        if (error) {
          console.error("Error updating goal progress:", error);
          toast({
            title: "Error updating progress",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error("Error in updateGoalProgress:", error);
      }
    }

    // Update local state (works for both with and without user)
    setGoals(prev => 
      prev.map(g => 
        g.id === id ? {...g, progress} : g
      )
    );
  };

  // Function to update goal dates
  const updateGoalDates = async (id: string, milestoneDate?: Date, finalDate?: Date) => {
    if (user) {
      try {
        const { error } = await supabase
          .from("goals")
          .update({
            milestone_date: milestoneDate ? milestoneDate.toISOString().split('T')[0] : null,
            final_date: finalDate ? finalDate.toISOString().split('T')[0] : null
          })
          .eq("id", id);

        if (error) {
          console.error("Error updating goal dates:", error);
          toast({
            title: "Error updating dates",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Dates Updated",
          description: "Goal dates have been updated successfully.",
        });
      } catch (error) {
        console.error("Error in updateGoalDates:", error);
      }
    }

    // Update local state (works for both with and without user)
    setGoals(prev => 
      prev.map(g => 
        g.id === id ? {...g, milestone_date: milestoneDate, final_date: finalDate} : g
      )
    );
  };

  return {
    goals,
    isLoading,
    addGoal,
    removeGoal,
    updateGoalProgress,
    updateGoalDates
  };
};
