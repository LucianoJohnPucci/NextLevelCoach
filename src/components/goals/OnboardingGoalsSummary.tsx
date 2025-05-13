
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flag, Goal, Milestone } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";

interface GoalSummary {
  id: string;
  title: string;
  category: string;
  timeframe?: string;
  milestone?: string;
}

export const useOnboardingGoals = () => {
  const { user } = useAuth();

  const fetchOnboardingAnswers = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching onboarding answers:", error);
      throw error;
    }

    return data;
  };

  const formatGoals = (answersData: any): GoalSummary[] => {
    if (!answersData) return [];

    const goals: GoalSummary[] = [];

    // Primary goal from question 1
    if (answersData.answer_1) {
      goals.push({
        id: "primary-goal",
        title: answersData.answer_1,
        category: "5-Year Goal",
        timeframe: "5 years"
      });
    }

    // Habits from question 2
    if (answersData.answer_2) {
      goals.push({
        id: "habits-goal",
        title: answersData.answer_2,
        category: "Habit Development",
        timeframe: "3 months"
      });
    }

    // Areas to improve from question 5
    if (answersData.answer_5) {
      const areas = answersData.answer_5.split(/[,.;]/).filter(Boolean);
      areas.forEach((area: string, index: number) => {
        if (area.trim()) {
          goals.push({
            id: `improvement-${index}`,
            title: area.trim(),
            category: "Area for Improvement",
            milestone: "Ongoing"
          });
        }
      });
    }

    // Success vision from question 10
    if (answersData.answer_10) {
      goals.push({
        id: "success-vision",
        title: answersData.answer_10,
        category: "Vision of Success",
        timeframe: "End of journey"
      });
    }

    return goals;
  };

  return useQuery({
    queryKey: ["onboardingGoals", user?.id],
    queryFn: async () => {
      const answers = await fetchOnboardingAnswers();
      return formatGoals(answers);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const OnboardingGoalsSummary = () => {
  const { data: goals, isLoading, error } = useOnboardingGoals();
  const { user } = useAuth();

  if (!user) return null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Goal className="h-5 w-5 text-primary" />
            Loading Your Goals...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-md bg-muted"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error("Error loading goals:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Goal className="h-5 w-5 text-primary" />
            Your Personalized Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There was an error loading your goals. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Goal className="h-5 w-5 text-primary" />
            Your Personalized Goals
          </CardTitle>
          <CardDescription>
            Complete the onboarding process to see your personalized goals and milestones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We'll help you track your progress toward your goals and provide accountability along the way.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Goal className="h-5 w-5 text-primary" />
          Your Personalized Goals
        </CardTitle>
        <CardDescription>
          Based on your answers during onboarding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div 
              key={goal.id} 
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {goal.category}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {goal.timeframe && (
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>Timeframe: {goal.timeframe}</span>
                    </div>
                  )}
                  {goal.milestone && (
                    <div className="flex items-center">
                      <Milestone className="mr-1 h-3 w-3" />
                      <span>Milestone: {goal.milestone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingGoalsSummary;
