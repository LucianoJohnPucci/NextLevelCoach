
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DailyGoal } from "@/pages/GoalsPage";

export const useDailyGoals = () => {
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load goals from localStorage on component mount
  useEffect(() => {
    const today = new Date().toDateString();
    const savedGoals = localStorage.getItem(`dailyGoals_${today}`);
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
          ...goal,
          added: new Date(goal.added)
        }));
        setGoals(parsedGoals);
      } catch (e) {
        console.error("Failed to parse saved goals:", e);
      }
    }
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length >= 0) {
      const today = new Date().toDateString();
      localStorage.setItem(`dailyGoals_${today}`, JSON.stringify(goals));
    }
  }, [goals]);

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
        title: "Limit Reached",
        description: "You can only have 3 daily goals at a time",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

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
      description: `"${title}" has been added to your daily goals.`,
    });

    setIsLoading(false);
    return true;
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal Removed",
      description: "The goal has been removed from your daily list.",
    });
  };

  const toggleGoalCompletion = (id: string) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const updateGoal = (id: string, updates: Partial<DailyGoal>) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      )
    );
    
    toast({
      title: "Goal Updated",
      description: "Your goal has been updated successfully.",
    });
  };

  return {
    goals,
    isLoading,
    addGoal,
    removeGoal,
    toggleGoalCompletion,
    updateGoal
  };
};
