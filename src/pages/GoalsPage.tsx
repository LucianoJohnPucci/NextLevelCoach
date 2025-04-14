
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";
import GoalsList from "@/components/goals/GoalsList";
import HabitsList from "@/components/goals/HabitsList";
import GoalDialog from "@/components/goals/GoalDialog";
import { useGoals } from "@/components/goals/useGoals";

export interface Goal {
  id: string;
  title: string;
  progress: number;
  added: Date;
  start_date?: Date;
}

export interface Habit {
  id: string;
  title: string;
  frequency: "D" | "W";
}

const GoalsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: "1", title: "Morning meditation", frequency: "D" },
    { id: "2", title: "Journal writing", frequency: "D" },
    { id: "3", title: "Yoga session", frequency: "W" },
    { id: "4", title: "Reading time", frequency: "D" },
  ]);

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());

  // Use the goals hook
  const { goals, isLoading, addGoal, removeGoal, updateGoalProgress } = useGoals();

  const handleAddGoal = async () => {
    const success = await addGoal(newGoalTitle, startDate);
    if (success) {
      // Reset form and close dialog
      setNewGoalTitle("");
      setStartDate(new Date());
      setOpenDialog(false);
    }
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
          <GoalsList 
            goals={goals} 
            updateGoalProgress={updateGoalProgress} 
            removeGoal={removeGoal} 
            onOpenDialog={() => setOpenDialog(true)}
          />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <CardTitle>Habits</CardTitle>
            </div>
            <CardDescription>Daily and weekly habits to build</CardDescription>
          </CardHeader>
          <HabitsList habits={habits} />
        </Card>
      </div>

      {/* Add Goal Dialog */}
      <GoalDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        goalTitle={newGoalTitle}
        setGoalTitle={setNewGoalTitle}
        startDate={startDate}
        setStartDate={setStartDate}
        onAddGoal={handleAddGoal}
        isLoading={isLoading}
      />
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
