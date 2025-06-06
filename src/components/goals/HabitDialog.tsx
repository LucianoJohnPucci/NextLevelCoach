
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Habit } from "./hooks";

interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitTitle: string;
  setHabitTitle: (value: string) => void;
  habitFrequency: "daily" | "weekly" | "monthly";
  setHabitFrequency: (value: "daily" | "weekly" | "monthly") => void;
  oldHabit: string;
  setOldHabit: (value: string) => void;
  newHabit: string;
  setNewHabit: (value: string) => void;
  habitRating: number;
  setHabitRating: (value: number) => void;
  onAddHabit: () => void;
  isLoading: boolean;
  habit?: Habit;
  isEditing?: boolean;
}

const HabitDialog = ({
  open,
  onOpenChange,
  habitTitle,
  setHabitTitle,
  habitFrequency,
  setHabitFrequency,
  oldHabit,
  setOldHabit,
  newHabit,
  setNewHabit,
  habitRating,
  setHabitRating,
  onAddHabit,
  isLoading,
  habit,
  isEditing = false,
}: HabitDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Habit" : "Add New Habit"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the details of your habit." 
              : "Enter the details of your new habit."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Habit Title</Label>
            <Input
              id="title"
              value={habitTitle}
              onChange={(e) => setHabitTitle(e.target.value)}
              placeholder="e.g., Morning meditation"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={habitFrequency}
              onValueChange={(value: "daily" | "weekly" | "monthly") => 
                setHabitFrequency(value)
              }
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="oldHabit">Old Habit (Optional)</Label>
            <Textarea
              id="oldHabit"
              value={oldHabit}
              onChange={(e) => setOldHabit(e.target.value)}
              placeholder="Habit you want to replace"
              className="resize-none"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="newHabit">New Habit (Optional)</Label>
            <Textarea
              id="newHabit"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Habit you want to build"
              className="resize-none"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Importance Rating</Label>
            <RadioGroup 
              value={habitRating.toString()} 
              onValueChange={(value) => setHabitRating(parseInt(value))}
              className="flex justify-between"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-1">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAddHabit} disabled={!habitTitle.trim() || isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Habit" : "Add Habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitDialog;
