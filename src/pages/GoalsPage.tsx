
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Target, CheckCircle, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  progress: number;
  added: Date;
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

  // Load goals from localStorage on component mount
  useEffect(() => {
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
  }, []);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userGoals", JSON.stringify(goals));
  }, [goals]);

  // Function to add a new goal
  const addGoal = (title: string) => {
    const newGoal = {
      id: Date.now().toString(),
      title,
      progress: 0,
      added: new Date()
    };
    
    setGoals(prev => [...prev, newGoal]);
    
    toast({
      title: "Goal Added",
      description: `"${title}" has been added to your goals.`,
    });
  };

  // Function to remove a goal
  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal Removed",
      description: "The goal has been removed from your list.",
    });
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
                    onValueChange={(value) => {
                      setGoals(prev => 
                        prev.map(g => 
                          g.id === goal.id ? {...g, progress: value[0]} : g
                        )
                      )
                    }}
                  />
                </div>
              ))}
            </div>
            
            <Button className="w-full gap-2">
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
    </div>
  );
};

// Export the component and also the addGoal function for use in other components
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
