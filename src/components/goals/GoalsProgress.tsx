
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Sparkles } from "lucide-react";
import GoalProgressItem from "./GoalProgressItem";
import GoalProgressSkeleton from "./GoalProgressSkeleton";
import { useGoalsProgress } from "./useGoalsProgress";

const GoalsProgress = () => {
  const icons = {
    mind: <Brain className="h-5 w-5" />,
    body: <Heart className="h-5 w-5" />,
    soul: <Sparkles className="h-5 w-5" />
  };
  
  const { goals, isLoading } = useGoalsProgress(icons);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Goal Progress Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <GoalProgressSkeleton />
        ) : (
          <>
            {goals.map((goal) => (
              <GoalProgressItem 
                key={goal.category}
                category={goal.category}
                percentage={goal.percentage}
                icon={goal.icon}
                color={goal.color}
              />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsProgress;
