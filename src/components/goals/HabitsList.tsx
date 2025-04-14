
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Habit } from "@/pages/GoalsPage";
import HabitItem from "./HabitItem";
import { CardContent } from "@/components/ui/card";

interface HabitsListProps {
  habits: Habit[];
  onAddHabit?: () => void;
}

const HabitsList = ({ habits, onAddHabit }: HabitsListProps) => {
  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))}
      </div>
      
      <Button className="w-full gap-2" onClick={onAddHabit}>
        <Plus className="h-4 w-4" />
        Add New Habit
      </Button>
    </CardContent>
  );
};

export default HabitsList;
