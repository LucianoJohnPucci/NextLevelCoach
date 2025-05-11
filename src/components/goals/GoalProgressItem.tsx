
import React from "react";
import { Progress } from "@/components/ui/progress";

interface GoalProgressItemProps {
  category: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

const GoalProgressItem = ({ category, percentage, icon, color }: GoalProgressItemProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1 text-primary">
            {icon}
          </div>
          <span className="font-medium">{category}</span>
        </div>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default GoalProgressItem;
