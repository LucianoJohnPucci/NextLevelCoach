
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface GoalProgress {
  category: string;
  percentage: number;
  icon: React.ReactNode;
}

const GoalsProgress = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalProgress[]>([
    { category: "Mind", percentage: 0, icon: <Brain className="h-5 w-5" /> },
    { category: "Body", percentage: 0, icon: <Heart className="h-5 w-5" /> },
    { category: "Soul", percentage: 0, icon: <Sparkles className="h-5 w-5" /> },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoalsProgress = async () => {
      if (!user) return;
      
      try {
        // Fetch goals from Supabase
        const { data: goalsData, error } = await supabase
          .from("goals")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching goals:", error);
          return;
        }

        if (goalsData) {
          // Calculate average progress for each category
          const mindGoals = goalsData.filter(goal => 
            goal.title.toLowerCase().includes("mind") || 
            goal.why?.toLowerCase().includes("mind")
          );
          
          const bodyGoals = goalsData.filter(goal => 
            goal.title.toLowerCase().includes("body") || 
            goal.why?.toLowerCase().includes("body")
          );
          
          const soulGoals = goalsData.filter(goal => 
            goal.title.toLowerCase().includes("soul") || 
            goal.why?.toLowerCase().includes("soul")
          );

          const calculateAverageProgress = (goals: any[]) => {
            if (goals.length === 0) return 0;
            const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
            return Math.round(totalProgress / goals.length);
          };

          setGoals([
            { category: "Mind", percentage: calculateAverageProgress(mindGoals), icon: <Brain className="h-5 w-5" /> },
            { category: "Body", percentage: calculateAverageProgress(bodyGoals), icon: <Heart className="h-5 w-5" /> },
            { category: "Soul", percentage: calculateAverageProgress(soulGoals), icon: <Sparkles className="h-5 w-5" /> },
          ]);
        }
      } catch (error) {
        console.error("Error calculating goals progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalsProgress();
  }, [user]);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Goal Progress Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full border-t-2 border-primary h-6 w-6"></div>
          </div>
        ) : (
          <>
            {goals.map((goal) => (
              <div key={goal.category} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      {goal.icon}
                    </div>
                    <span className="font-medium">{goal.category}</span>
                  </div>
                  <span className="text-sm font-medium">{goal.percentage}%</span>
                </div>
                <Progress value={goal.percentage} className="h-2" />
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsProgress;
