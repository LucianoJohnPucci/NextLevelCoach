
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const GoalProgressSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  );
};

export default GoalProgressSkeleton;
