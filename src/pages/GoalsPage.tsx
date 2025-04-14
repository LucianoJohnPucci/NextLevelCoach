
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle, Plus, Trash2, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface Goal {
  id: string;
  title: string;
  progress: number;
  added: Date;
  start_date?: Date;
}

interface Habit {
  id: string;
  title: string;
  frequency: "D" | "W";
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", title: "Morning meditation", frequency: "D" },
    { id: "2", title: "Journal writing", frequency: "D" },
    { id: "3", title: "Yoga session", frequency: "W" },
    { id: "4", title: "Reading time", frequency: "D" },
  ]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

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
        }));
        setGoals(formattedGoals);
      }
    } catch (error) {
      console.error("Error in fetchGoals:", error);
    }
  };

  // Load goals from Supabase when the component mounts
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
  const addGoal = async () => {
    if (!newGoalTitle.trim()) {
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
              title: newGoalTitle,
              user_id: user.id,
              start_date: startDate.toISOString().split('T')[0],
              progress: 0,
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
          description: `"${newGoalTitle}" has been added to your goals.`,
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
        title: newGoalTitle,
        progress: 0,
        added: new Date(),
        start_date: startDate
      };
      
      setGoals(prev => [...prev, newGoal]);
      
      toast({
        title: "Goal Added",
        description: `"${newGoalTitle}" has been added to your goals.`,
      });
    }

    // Reset form and close dialog
    setNewGoalTitle("");
    setStartDate(new Date());
    setOpenDialog(false);
    setIsLoading(false);
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Goals & Habits</h1>
        <p className="text-muted-foreground">
          Set meaningful goals and build lasting positive habits.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>Active Goals</CardTitle>
            </div>
            <CardDescription>Your current goals and their progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{goal.title}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">{goal.progress}%</div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive" 
                        onClick={() => removeGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Slider 
                    defaultValue={[goal.progress]} 
                    max={100} 
                    step={1} 
                    className="cursor-default" 
                    onValueChange={(value) => updateGoalProgress(goal.id, value[0])}
                  />
                  {goal.start_date && (
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      Start date: {format(goal.start_date, 'PP')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button className="w-full gap-2" onClick={() => setOpenDialog(true)}>
              <Plus className="h-4 w-4" />
              Add New Goal
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <CardTitle>Habits</CardTitle>
            </div>
            <CardDescription>Daily and weekly habits to build</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="font-medium">{habit.title}</div>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {habit.frequency}
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add New Habit
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                placeholder="Enter your goal"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={addGoal} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalsPage;
export { type Goal };

// Export a helper function that can be used by other components
export const addGoalToLocalStorage = (title: string) => {
  const savedGoals = localStorage.getItem("userGoals");
  let currentGoals: Goal[] = [];
  
  if (savedGoals) {
    try {
      currentGoals = JSON.parse(savedGoals);
    } catch (e) {
      console.error("Failed to parse saved goals:", e);
      currentGoals = [];
    }
  }
  
  const newGoal = {
    id: Date.now().toString(),
    title,
    progress: 0,
    added: new Date()
  };
  
  const updatedGoals = [...currentGoals, newGoal];
  localStorage.setItem("userGoals", JSON.stringify(updatedGoals));
  
  return newGoal;
};
