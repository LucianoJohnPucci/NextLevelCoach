
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, XCircle, CheckCircle } from "lucide-react";
import { Habit } from "./hooks";

interface HabitTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit & {
    current_streak?: number;
    today_completed?: boolean;
    today_avoided_old_habit?: boolean;
    today_practiced_new_habit?: boolean;
    completion_rate?: number;
  };
  onTrackProgress?: (
    habitId: string, 
    completed: boolean, 
    avoidedOld?: boolean, 
    practicedNew?: boolean,
    notes?: string
  ) => void;
}

const HabitTrackingDialog = ({ 
  open, 
  onOpenChange, 
  habit,
  onTrackProgress
}: HabitTrackingDialogProps) => {
  const [completed, setCompleted] = useState(habit.today_completed || false);
  const [avoidedOldHabit, setAvoidedOldHabit] = useState(habit.today_avoided_old_habit || false);
  const [practicedNewHabit, setPracticedNewHabit] = useState(habit.today_practiced_new_habit || false);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (onTrackProgress) {
      onTrackProgress(habit.id, completed, avoidedOldHabit, practicedNewHabit, notes);
    }
    onOpenChange(false);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 21) return "text-purple-600 bg-purple-50";
    if (streak >= 7) return "text-green-600 bg-green-50";
    if (streak >= 3) return "text-blue-600 bg-blue-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Track Progress: {habit.title}
          </DialogTitle>
          <DialogDescription>
            Update your progress for today and track your habit development.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Streak and Stats */}
          <div className="flex gap-2 flex-wrap">
            {habit.current_streak !== undefined && (
              <Badge className={`${getStreakColor(habit.current_streak)}`}>
                <Flame className="w-3 h-3 mr-1" />
                {habit.current_streak} day streak
              </Badge>
            )}
            {habit.completion_rate !== undefined && (
              <Badge variant="outline">
                {habit.completion_rate}% success rate
              </Badge>
            )}
          </div>

          {/* Main completion checkbox */}
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <Checkbox
              id="completed"
              checked={completed}
              onCheckedChange={(checked) => setCompleted(checked as boolean)}
            />
            <Label htmlFor="completed" className="font-medium">
              I completed this habit today
            </Label>
          </div>

          {/* Old habit avoidance */}
          {habit.old_habit && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-500" />
                Old Habit to Avoid
              </Label>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm mb-2">{habit.old_habit}</p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avoided"
                    checked={avoidedOldHabit}
                    onCheckedChange={(checked) => setAvoidedOldHabit(checked as boolean)}
                  />
                  <Label htmlFor="avoided" className="text-sm">
                    I successfully avoided this today
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* New habit practice */}
          {habit.new_habit && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="w-4 h-4 text-green-500" />
                New Habit to Practice
              </Label>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm mb-2">{habit.new_habit}</p>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="practiced"
                    checked={practicedNewHabit}
                    onCheckedChange={(checked) => setPracticedNewHabit(checked as boolean)}
                  />
                  <Label htmlFor="practiced" className="text-sm">
                    I practiced this new habit today
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go? Any challenges or wins?"
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Save Progress
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitTrackingDialog;
