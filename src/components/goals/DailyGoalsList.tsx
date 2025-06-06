
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DailyGoal } from "@/pages/GoalsPage";
import DailyGoalItem from "./DailyGoalItem";
import { CardContent } from "@/components/ui/card";

interface DailyGoalsListProps {
  goals: DailyGoal[];
  onAddGoal: () => void;
  onRemoveGoal: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  onUpdateGoal: (id: string, updates: Partial<DailyGoal>) => void;
}

const DailyGoalsList = ({ 
  goals, 
  onAddGoal, 
  onRemoveGoal, 
  onToggleCompletion,
  onUpdateGoal 
}: DailyGoalsListProps) => {
  const canAddMore = goals.length < 3;

  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {goals.map((goal) => (
          <DailyGoalItem 
            key={goal.id} 
            goal={goal} 
            onRemove={onRemoveGoal}
            onToggleCompletion={onToggleCompletion}
            onUpdate={onUpdateGoal}
          />
        ))}
        
        {goals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No goals set for today. Add your first goal to get started!</p>
          </div>
        )}
      </div>
      
      {canAddMore && (
        <Button className="w-full gap-2" onClick={onAddGoal}>
          <Plus className="h-4 w-4" />
          Add Goal ({goals.length}/3)
        </Button>
      )}
      
      {!canAddMore && (
        <p className="text-sm text-muted-foreground text-center">
          You've reached the maximum of 3 daily goals. Complete or remove a goal to add another.
        </p>
      )}
    </CardContent>
  );
};

export default DailyGoalsList;
