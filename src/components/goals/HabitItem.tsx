
import React from "react";
import { Habit } from "@/pages/GoalsPage";

interface HabitItemProps {
  habit: Habit;
}

const HabitItem = ({ habit }: HabitItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="font-medium">{habit.title}</div>
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
        {habit.frequency}
      </div>
    </div>
  );
};

export default HabitItem;
