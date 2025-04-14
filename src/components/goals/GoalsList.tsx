
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Goal } from "@/pages/GoalsPage";
import GoalItem from "./GoalItem";
import { CardContent } from "@/components/ui/card";

interface GoalsListProps {
  goals: Goal[];
  updateGoalProgress: (id: string, progress: number) => void;
  removeGoal: (id: string) => void;
  onOpenDialog: () => void;
}

const GoalsList = ({ goals, updateGoalProgress, removeGoal, onOpenDialog }: GoalsListProps) => {
  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalItem 
            key={goal.id} 
            goal={goal} 
            updateGoalProgress={updateGoalProgress} 
            removeGoal={removeGoal} 
          />
        ))}
      </div>
      
      <Button className="w-full gap-2" onClick={onOpenDialog}>
        <Plus className="h-4 w-4" />
        Add New Goal
      </Button>
    </CardContent>
  );
};

export default GoalsList;
