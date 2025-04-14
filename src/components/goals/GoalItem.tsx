
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarIcon, Target } from "lucide-react";
import { format } from "date-fns";
import { Goal } from "@/pages/GoalsPage";

interface GoalItemProps {
  goal: Goal;
  updateGoalProgress: (id: string, progress: number) => void;
  removeGoal: (id: string) => void;
}

const GoalItem = ({ goal, updateGoalProgress, removeGoal }: GoalItemProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{goal.title}</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">{goal.progress}%</div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive" 
            onClick={() => removeGoal(goal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Slider 
        defaultValue={[goal.progress]} 
        max={100} 
        step={1} 
        className="cursor-default" 
        onValueChange={(value) => updateGoalProgress(goal.id, value[0])}
      />
      {goal.why && (
        <div className="text-xs text-muted-foreground flex items-center mt-1">
          <Target className="h-3 w-3 mr-1" />
          Why: {goal.why}
        </div>
      )}
      {goal.start_date && (
        <div className="text-xs text-muted-foreground flex items-center mt-1">
          <CalendarIcon className="h-3 w-3 mr-1" />
          Start date: {format(goal.start_date, 'PP')}
        </div>
      )}
    </div>
  );
};

export default GoalItem;
