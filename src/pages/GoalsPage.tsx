
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, Zap, ListCheck } from "lucide-react";
import DailyGoalsList from "@/components/goals/DailyGoalsList";
import DailyGoalDialog from "@/components/goals/DailyGoalDialog";
import HabitsList from "@/components/goals/HabitsList";
import HabitDialog from "@/components/goals/HabitDialog";
import DailyChecklist from "@/components/daily/DailyChecklist";
import { useDailyGoals } from "@/components/goals/useDailyGoals";
import { useHabits } from "@/components/goals/hooks";

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

  const [openHabitDialog, setOpenHabitDialog] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitFrequency, setHabitFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [oldHabit, setOldHabit] = useState("");
  const [newHabit, setNewHabit] = useState("");
  const [habitRating, setHabitRating] = useState(3);
  const [editingHabit, setEditingHabit] = useState<any>(null);

  const { 
    goals, 
    isLoading: goalsLoading, 
    addGoal, 
    removeGoal, 
    toggleGoalCompletion,
    updateGoal
  } = useDailyGoals();

  const {
    habits,
    isLoading: habitsLoading,
    addHabit,
    removeHabit,
    updateHabit,
    trackProgress: trackHabitProgress
  } = useHabits();

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

  const handleAddHabit = async () => {
    if (editingHabit) {
      const success = await updateHabit(editingHabit.id, {
        title: habitTitle,
        frequency: habitFrequency,
        old_habit: oldHabit,
        new_habit: newHabit,
        rating: habitRating
      });
      if (success) {
        resetHabitForm();
      }
    } else {
      const success = await addHabit(
        habitTitle,
        habitFrequency,
        oldHabit,
        newHabit,
        habitRating
      );
      if (success) {
        resetHabitForm();
      }
    }
  };

  const resetHabitForm = () => {
    setHabitTitle("");
    setHabitFrequency("daily");
    setOldHabit("");
    setNewHabit("");
    setHabitRating(3);
    setEditingHabit(null);
    setOpenHabitDialog(false);
  };

  const handleEditHabit = (habit: any) => {
    setHabitTitle(habit.title);
    setHabitFrequency(habit.frequency);
    setOldHabit(habit.old_habit || "");
    setNewHabit(habit.new_habit || "");
    setHabitRating(habit.rating || 3);
    setEditingHabit(habit);
    setOpenHabitDialog(true);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Goals & Habits</h1>
        <p className="text-muted-foreground">
          Set your top 3 goals for today and build positive habits.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListCheck className="h-5 w-5 text-primary" />
            <CardTitle>Daily Process Checklist</CardTitle>
          </div>
          <CardDescription>Complete these steps to stay on track with your wellness journey</CardDescription>
        </CardHeader>
        <DailyChecklist recordsEnabled={true} />
      </Card>

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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Habit Transformation</CardTitle>
          </div>
          <CardDescription>Replace bad habits with good ones and track your progress with streaks</CardDescription>
        </CardHeader>
        <HabitsList 
          habits={habits}
          onAddHabit={() => setOpenHabitDialog(true)}
          onEditHabit={handleEditHabit}
          onDeleteHabit={removeHabit}
          onTrackProgress={trackHabitProgress}
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
        isLoading={goalsLoading}
      />

      <HabitDialog
        open={openHabitDialog}
        onOpenChange={(open) => {
          setOpenHabitDialog(open);
          if (!open) {
            resetHabitForm();
          }
        }}
        habitTitle={habitTitle}
        setHabitTitle={setHabitTitle}
        habitFrequency={habitFrequency}
        setHabitFrequency={setHabitFrequency}
        oldHabit={oldHabit}
        setOldHabit={setOldHabit}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        habitRating={habitRating}
        setHabitRating={setHabitRating}
        onAddHabit={handleAddHabit}
        isLoading={habitsLoading}
        habit={editingHabit}
        isEditing={!!editingHabit}
      />
    </div>
  );
};

export default GoalsPage;
