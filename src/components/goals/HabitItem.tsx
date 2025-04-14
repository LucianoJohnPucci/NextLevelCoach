
import React from "react";
import { Habit } from "./useHabits";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface HabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitItem = ({ habit, onEdit, onDelete }: HabitItemProps) => {
  const getFrequencyDisplay = (frequency: string) => {
    switch (frequency) {
      case "daily": return "D";
      case "weekly": return "W";
      case "monthly": return "M";
      default: return frequency.charAt(0).toUpperCase();
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="font-medium">{habit.title}</div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {getFrequencyDisplay(habit.frequency)}
          </div>
          {habit.rating && (
            <div className="text-xs bg-secondary px-2 py-0.5 rounded-full">
              Rating: {habit.rating}/5
            </div>
          )}
        </div>
        
        {(habit.old_habit || habit.new_habit) && (
          <div className="text-sm text-muted-foreground">
            {habit.old_habit && <p>Old: {habit.old_habit}</p>}
            {habit.new_habit && <p>New: {habit.new_habit}</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onEdit(habit)}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(habit.id)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default HabitItem;
