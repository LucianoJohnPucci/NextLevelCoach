
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import HabitItem from "./HabitItem";
import { Habit } from "./useHabits";

interface HabitsListProps {
  habits: Habit[];
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
}

const HabitsList = ({ habits, onAddHabit, onEditHabit, onDeleteHabit }: HabitsListProps) => {
  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {habits.map((habit) => (
          <HabitItem 
            key={habit.id} 
            habit={habit} 
            onEdit={onEditHabit} 
            onDelete={onDeleteHabit} 
          />
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
