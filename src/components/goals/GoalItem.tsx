
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Trash2, CalendarIcon, Target, Calendar, CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { Goal } from "@/pages/GoalsPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface GoalItemProps {
  goal: Goal;
  updateGoalProgress: (id: string, progress: number) => void;
  removeGoal: (id: string) => void;
  updateGoalDates?: (id: string, milestoneDate?: Date, finalDate?: Date) => void;
}

const GoalItem = ({ goal, updateGoalProgress, removeGoal, updateGoalDates }: GoalItemProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [milestoneDate, setMilestoneDate] = useState<Date | undefined>(goal.milestone_date);
  const [finalDate, setFinalDate] = useState<Date | undefined>(goal.final_date);

  const handleSaveDates = () => {
    if (updateGoalDates) {
      updateGoalDates(goal.id, milestoneDate, finalDate);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{goal.title}</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">{goal.progress}%</div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Calendar className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Goal Dates</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <h4 className="font-medium">On Track Milestone Date (Optional)</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !milestoneDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        {milestoneDate ? format(milestoneDate, "PPP") : <span>Pick a milestone date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={milestoneDate}
                        onSelect={setMilestoneDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <h4 className="font-medium">Final Goal Date (Optional)</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !finalDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {finalDate ? format(finalDate, "PPP") : <span>Pick a final date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={finalDate}
                        onSelect={setFinalDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveDates}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
        {goal.why && (
          <div className="flex items-center mt-1">
            <Target className="h-3 w-3 mr-1" />
            <span>Why: {goal.why}</span>
          </div>
        )}
        {goal.start_date && (
          <div className="flex items-center mt-1">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Start: {format(goal.start_date, 'PP')}</span>
          </div>
        )}
        {goal.milestone_date && (
          <div className="flex items-center mt-1">
            <CalendarCheck className="h-3 w-3 mr-1" />
            <span>Milestone: {format(goal.milestone_date, 'PP')}</span>
          </div>
        )}
        {goal.final_date && (
          <div className="flex items-center mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Deadline: {format(goal.final_date, 'PP')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalItem;
