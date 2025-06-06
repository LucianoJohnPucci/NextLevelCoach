
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import HabitItem from "./HabitItem";
import { Habit } from "./hooks";

interface HabitsListProps {
  habits: any[];
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onTrackProgress?: (habitId: string, completed: boolean, avoidedOld?: boolean, practicedNew?: boolean, notes?: string) => void;
}

const HabitsList = ({ 
  habits, 
  onAddHabit, 
  onEditHabit, 
  onDeleteHabit,
  onTrackProgress 
}: HabitsListProps) => {
  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {habits.map((habit) => (
          <HabitItem 
            key={habit.id} 
            habit={habit} 
            onEdit={onEditHabit} 
            onDelete={onDeleteHabit}
            onTrackProgress={onTrackProgress}
          />
        ))}
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No habits created yet. Start building positive habits today!</p>
          </div>
        )}
      </div>
      
      <Button className="w-full gap-2" onClick={onAddHabit}>
        <Plus className="h-4 w-4" />
        Add New Habit
      </Button>
    </CardContent>
  );
};

export default HabitsList;
