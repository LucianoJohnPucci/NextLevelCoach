import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ListCheck, Plus, Clock } from "lucide-react";
import DailyChecklist from "@/components/daily/DailyChecklist";
import HabitsList from "@/components/goals/HabitsList";
import HabitDialog from "@/components/goals/HabitDialog";
import { useHabits } from "@/components/goals/hooks";

/**
 * Dedicated page combining Habit tracking (Habit Transformation) and Daily Process
 * Checklist (acts as a simple time-blocking flow).  
 * "Time Blocking" features can be expanded later.
 */
const HabitsPage = () => {
  const [openHabitDialog, setOpenHabitDialog] = useState(false);
  const [habitTitle, setHabitTitle] = useState("");
  const [habitFrequency, setHabitFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [oldHabit, setOldHabit] = useState("");
  const [newHabit, setNewHabit] = useState("");
  const [habitRating, setHabitRating] = useState(3);
  const [editingHabit, setEditingHabit] = useState<any>(null);

  const {
    habits,
    isLoading: habitsLoading,
    addHabit,
    removeHabit,
    updateHabit,
    trackProgress: trackHabitProgress,
  } = useHabits();

  const handleAddHabit = async () => {
    if (editingHabit) {
      const success = await updateHabit(editingHabit.id, {
        title: habitTitle,
        frequency: habitFrequency,
        old_habit: oldHabit,
        new_habit: newHabit,
        rating: habitRating,
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
        habitRating,
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
        <h1 className="text-3xl font-bold tracking-tight">Habits &amp; Time Blocking</h1>
        <p className="text-muted-foreground">
          Replace bad habits with good ones, track daily progress, and structure your day with guided checklists.
        </p>
      </div>

      {/* Daily Process Checklist */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ListCheck className="h-5 w-5 text-primary" />
            <CardTitle>Daily Process Checklist</CardTitle>
          </div>
          <CardDescription>
            Complete these steps to stay on track with your wellness journey
          </CardDescription>
        </CardHeader>
        <DailyChecklist recordsEnabled={true} />
      </Card>

      {/* Habit transformation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Habit Transformation</CardTitle>
          </div>
          <CardDescription>
            Replace bad habits with good ones and track your progress with streaks
          </CardDescription>
        </CardHeader>
        <HabitsList
          habits={habits}
          onAddHabit={() => setOpenHabitDialog(true)}
          onEditHabit={handleEditHabit}
          onDeleteHabit={removeHabit}
          onTrackProgress={trackHabitProgress}
        />
      </Card>

      {/* Dialog */}
      <HabitDialog
        open={openHabitDialog}
        onOpenChange={(open) => {
          setOpenHabitDialog(open);
          if (!open) resetHabitForm();
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

export default HabitsPage;
