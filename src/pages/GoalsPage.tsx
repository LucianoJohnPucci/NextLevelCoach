
import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";
import GoalsList from "@/components/goals/GoalsList";
import HabitsList from "@/components/goals/HabitsList";
import GoalDialog from "@/components/goals/GoalDialog";
import HabitDialog from "@/components/goals/HabitDialog";
import { useGoals } from "@/components/goals/useGoals";
import { useHabits, Habit } from "@/components/goals/hooks";

export interface Goal {
  id: string;
  title: string;
  progress: number;
  added: Date;
  start_date?: Date;
  milestone_date?: Date;
  final_date?: Date;
  why?: string;
}

const GoalsPage = () => {
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [openHabitDialog, setOpenHabitDialog] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalWhy, setNewGoalWhy] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [milestoneDate, setMilestoneDate] = useState<Date | undefined>(undefined);
  const [finalDate, setFinalDate] = useState<Date | undefined>(undefined);
  
  const [habitTitle, setHabitTitle] = useState("");
  const [habitFrequency, setHabitFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [oldHabit, setOldHabit] = useState("");
  const [newHabit, setNewHabit] = useState("");
  const [habitRating, setHabitRating] = useState<number>(3);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { 
    goals, 
    isLoading: isGoalsLoading, 
    addGoal, 
    removeGoal, 
    updateGoalProgress,
    updateGoalDates
  } = useGoals();
  const { 
    habits, 
    isLoading: isHabitsLoading, 
    addHabit, 
    removeHabit, 
    updateHabit 
  } = useHabits();

  const handleAddGoal = async () => {
    const success = await addGoal(newGoalTitle, startDate, newGoalWhy, milestoneDate, finalDate);
    if (success) {
      setNewGoalTitle("");
      setNewGoalWhy("");
      setStartDate(new Date());
      setMilestoneDate(undefined);
      setFinalDate(undefined);
      setOpenGoalDialog(false);
    }
  };

  const handleAddHabit = async () => {
    let success;
    
    if (editingHabit) {
      // Update existing habit
      success = await updateHabit(editingHabit.id, {
        title: habitTitle,
        frequency: habitFrequency,
        old_habit: oldHabit || undefined,
        new_habit: newHabit || undefined,
        rating: habitRating
      });
    } else {
      // Add new habit
      success = await addHabit(
        habitTitle, 
        habitFrequency, 
        oldHabit || undefined, 
        newHabit || undefined, 
        habitRating
      );
    }
    
    if (success) {
      resetHabitForm();
      setOpenHabitDialog(false);
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setHabitTitle(habit.title);
    setHabitFrequency(habit.frequency);
    setOldHabit(habit.old_habit || "");
    setNewHabit(habit.new_habit || "");
    setHabitRating(habit.rating || 3);
    setOpenHabitDialog(true);
  };

  const handleDeleteHabit = (id: string) => {
    removeHabit(id);
  };

  const resetHabitForm = () => {
    setHabitTitle("");
    setHabitFrequency("daily");
    setOldHabit("");
    setNewHabit("");
    setHabitRating(3);
    setEditingHabit(null);
  };

  const openAddHabitDialog = () => {
    resetHabitForm();
    setOpenHabitDialog(true);
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
            onOpenDialog={() => setOpenGoalDialog(true)}
            updateGoalDates={updateGoalDates}
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
          <HabitsList 
            habits={habits} 
            onAddHabit={openAddHabitDialog}
            onEditHabit={handleEditHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        </Card>
      </div>

      <GoalDialog
        open={openGoalDialog}
        onOpenChange={setOpenGoalDialog}
        goalTitle={newGoalTitle}
        setGoalTitle={setNewGoalTitle}
        goalWhy={newGoalWhy}
        setGoalWhy={setNewGoalWhy}
        startDate={startDate}
        setStartDate={setStartDate}
        milestoneDate={milestoneDate}
        setMilestoneDate={setMilestoneDate}
        finalDate={finalDate}
        setFinalDate={setFinalDate}
        onAddGoal={handleAddGoal}
        isLoading={isGoalsLoading}
      />

      <HabitDialog
        open={openHabitDialog}
        onOpenChange={setOpenHabitDialog}
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
        isLoading={isHabitsLoading}
        habit={editingHabit || undefined}
        isEditing={!!editingHabit}
      />
    </div>
  );
};

export default GoalsPage;
