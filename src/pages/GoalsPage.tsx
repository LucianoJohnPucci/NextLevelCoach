
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock } from "lucide-react";
import DailyGoalsList from "@/components/goals/DailyGoalsList";
import DailyGoalDialog from "@/components/goals/DailyGoalDialog";
import { useDailyGoals } from "@/components/goals/useDailyGoals";

export interface DailyGoal {
  id: string;
  title: string;
  category: "mind" | "body" | "soul";
  startTime: string;
  duration: number; // in minutes
  completed: boolean;
  added: Date;
}

const GoalsPage = () => {
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState<"mind" | "body" | "soul">("mind");
  const [newGoalStartTime, setNewGoalStartTime] = useState("");
  const [newGoalDuration, setNewGoalDuration] = useState(60);

  const { 
    goals, 
    isLoading, 
    addGoal, 
    removeGoal, 
    toggleGoalCompletion,
    updateGoal
  } = useDailyGoals();

  const handleAddGoal = async () => {
    const success = await addGoal(
      newGoalTitle, 
      newGoalCategory, 
      newGoalStartTime, 
      newGoalDuration
    );
    if (success) {
      setNewGoalTitle("");
      setNewGoalCategory("mind");
      setNewGoalStartTime("");
      setNewGoalDuration(60);
      setOpenGoalDialog(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Goals & Habits</h1>
        <p className="text-muted-foreground">
          Set your top 3 goals for today with time blocking.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Today's Top 3 Goals</CardTitle>
          </div>
          <CardDescription>Schedule your most important goals with time blocks</CardDescription>
        </CardHeader>
        <DailyGoalsList 
          goals={goals} 
          onAddGoal={() => setOpenGoalDialog(true)}
          onRemoveGoal={removeGoal}
          onToggleCompletion={toggleGoalCompletion}
          onUpdateGoal={updateGoal}
        />
      </Card>

      <DailyGoalDialog
        open={openGoalDialog}
        onOpenChange={setOpenGoalDialog}
        goalTitle={newGoalTitle}
        setGoalTitle={setNewGoalTitle}
        goalCategory={newGoalCategory}
        setGoalCategory={setNewGoalCategory}
        startTime={newGoalStartTime}
        setStartTime={setNewGoalStartTime}
        duration={newGoalDuration}
        setDuration={setNewGoalDuration}
        onAddGoal={handleAddGoal}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GoalsPage;
