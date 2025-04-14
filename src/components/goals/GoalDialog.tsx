
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalTitle: string;
  setGoalTitle: (title: string) => void;
  goalWhy: string;
  setGoalWhy: (why: string) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  onAddGoal: () => void;
  isLoading: boolean;
}

const GoalDialog = ({
  open,
  onOpenChange,
  goalTitle,
  setGoalTitle,
  goalWhy,
  setGoalWhy,
  startDate,
  setStartDate,
  onAddGoal,
  isLoading
}: GoalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="goal-title">Goal Title</Label>
            <Input
              id="goal-title"
              placeholder="Enter your goal"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="goal-why">Why This Goal?</Label>
            <Textarea
              id="goal-why"
              placeholder="Describe why this goal is important to you"
              value={goalWhy}
              onChange={(e) => setGoalWhy(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="start-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddGoal} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoalDialog;
