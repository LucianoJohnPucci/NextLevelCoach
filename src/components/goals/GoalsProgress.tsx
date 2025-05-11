
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface GoalProgress {
  category: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

interface GoalProgressData {
  name: string;
  Mind: number;
  Body: number;
  Soul: number;
}

const GoalsProgress = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalProgress[]>([
    { category: "Mind", percentage: 0, icon: <Brain className="h-5 w-5" />, color: "#3b82f6" },
    { category: "Body", percentage: 0, icon: <Heart className="h-5 w-5" />, color: "#ef4444" },
    { category: "Soul", percentage: 0, icon: <Sparkles className="h-5 w-5" />, color: "#8b5cf6" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<GoalProgressData[]>([]);

  useEffect(() => {
    const fetchGoalsProgress = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch mind goals from Supabase
        const { data: mindGoals, error: mindError } = await supabase
          .from("mind_goals")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (mindError && mindError.code !== 'PGRST116') {
          console.error("Error fetching mind goals:", mindError);
        }

        // Fetch body goals from Supabase
        const { data: bodyGoals, error: bodyError } = await supabase
          .from("body_goals")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (bodyError && bodyError.code !== 'PGRST116') {
          console.error("Error fetching body goals:", bodyError);
        }

        // Fetch soul goals from Supabase
        const { data: soulGoals, error: soulError } = await supabase
          .from("soul_goals")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (soulError && soulError.code !== 'PGRST116') {
          console.error("Error fetching soul goals:", soulError);
        }

        // Calculate average progress for each category
        const calculateAverageProgress = (goalsObj: any) => {
          if (!goalsObj) return 0;
          
          // Remove these properties from calculation
          const excludeProps = ['id', 'user_id', 'created_at', 'updated_at'];
          
          let total = 0;
          let count = 0;
          
          for (const key in goalsObj) {
            if (!excludeProps.includes(key) && typeof goalsObj[key] === 'number') {
              total += goalsObj[key];
              count++;
            }
          }
          
          return count > 0 ? Math.round(total / count) : 0;
        };

        const mindProgress = calculateAverageProgress(mindGoals);
        const bodyProgress = calculateAverageProgress(bodyGoals);
        const soulProgress = calculateAverageProgress(soulGoals);

        setGoals([
          { category: "Mind", percentage: mindProgress, icon: <Brain className="h-5 w-5" />, color: "#3b82f6" },
          { category: "Body", percentage: bodyProgress, icon: <Heart className="h-5 w-5" />, color: "#ef4444" },
          { category: "Soul", percentage: soulProgress, icon: <Sparkles className="h-5 w-5" />, color: "#8b5cf6" },
        ]);

        // Create chart data
        setProgressData([
          {
            name: "Current Progress",
            Mind: mindProgress,
            Body: bodyProgress,
            Soul: soulProgress
          }
        ]);

        // If user doesn't have records yet, create them
        if (!mindGoals && user) {
          await supabase.from("mind_goals").insert([{ user_id: user.id }]);
        }
        
        if (!bodyGoals && user) {
          await supabase.from("body_goals").insert([{ user_id: user.id }]);
        }
        
        if (!soulGoals && user) {
          await supabase.from("soul_goals").insert([{ user_id: user.id }]);
        }

      } catch (error) {
        console.error("Error calculating goals progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalsProgress();
  }, [user]);

  const chartConfig = {
    Mind: { color: "#3b82f6" },
    Body: { color: "#ef4444" },
    Soul: { color: "#8b5cf6" },
  };

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

            <div className="pt-4 h-[180px]">
              <ChartContainer config={chartConfig}>
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            className="min-w-[150px]"
                            indicator="line"
                            formatter={(value) => `${value}%`}
                          />
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Mind" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Body" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Soul" 
                    stackId="1" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsProgress;
