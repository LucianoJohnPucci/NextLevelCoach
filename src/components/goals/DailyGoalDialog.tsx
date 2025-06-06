
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Heart, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DailyGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalTitle: string;
  setGoalTitle: (title: string) => void;
  goalCategory: "mind" | "body" | "soul";
  setGoalCategory: (category: "mind" | "body" | "soul") => void;
  startTime: string;
  setStartTime: (time: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  onAddGoal: () => void;
  isLoading: boolean;
  isEditing?: boolean;
}

const DailyGoalDialog = ({
  open,
  onOpenChange,
  goalTitle,
  setGoalTitle,
  goalCategory,
  setGoalCategory,
  startTime,
  setStartTime,
  duration,
  setDuration,
  onAddGoal,
  isLoading,
  isEditing = false
}: DailyGoalDialogProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mind": return <Brain className="h-4 w-4" />;
      case "body": return <Heart className="h-4 w-4" />;
      case "soul": return <Sparkles className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Goal" : "Add Daily Goal"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="goal-title">Goal Title</Label>
            <Input
              id="goal-title"
              placeholder="What do you want to accomplish?"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="goal-category">Category</Label>
            <Select value={goalCategory} onValueChange={setGoalCategory}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(goalCategory)}
                    <span className="capitalize">{goalCategory}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mind">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>Mind</span>
                  </div>
                </SelectItem>
                <SelectItem value="body">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>Body</span>
                  </div>
                </SelectItem>
                <SelectItem value="soul">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Soul</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select 
              value={duration.toString()} 
              onValueChange={(value) => setDuration(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="180">3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddGoal} disabled={isLoading || !goalTitle.trim()}>
            {isLoading ? "Saving..." : isEditing ? "Update Goal" : "Add Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyGoalDialog;
