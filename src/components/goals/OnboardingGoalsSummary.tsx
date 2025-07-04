
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Flag, Goal, Milestone, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format, differenceInDays } from "date-fns";

interface GoalSummary {
  id: string;
  title: string;
  category: string;
  timeframe?: string;
  milestone?: string;
  startDate?: Date; // Added start date field
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
    
    const currentDate = new Date();
    const goals: GoalSummary[] = [];

    // Primary goal from question 1
    if (answersData.answer_1) {
      goals.push({
        id: "primary-goal",
        title: answersData.answer_1,
        category: "5-Year Goal",
        timeframe: "5 years",
        startDate: new Date(answersData.signup_date || currentDate) // Use signup date as start date
      });
    }

    // Habits from question 2
    if (answersData.answer_2) {
      goals.push({
        id: "habits-goal",
        title: answersData.answer_2,
        category: "Habit Development",
        timeframe: "3 months",
        startDate: new Date(answersData.signup_date || currentDate) // Use signup date as start date
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
            milestone: "Ongoing",
            startDate: new Date(answersData.signup_date || currentDate) // Use signup date as start date
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
        timeframe: "End of journey",
        startDate: new Date(answersData.signup_date || currentDate) // Use signup date as start date
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
  const today = new Date();

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
          {goals.map((goal) => {
            // Calculate days since goal started
            const daysSinceStart = goal.startDate ? differenceInDays(today, goal.startDate) : 0;
            
            return (
              <div 
                key={goal.id} 
                className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Left side: Days count */}
                  <div className="flex flex-col items-center justify-center bg-primary/5 rounded-lg p-3">
                    <span className="text-3xl font-bold text-primary">{daysSinceStart}</span>
                    <span className="text-xs text-muted-foreground">days</span>
                  </div>
                  
                  {/* Right side: Goal details */}
                  <div className="md:col-span-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{goal.title}</h3>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {goal.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {goal.startDate && (
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>Started: {format(goal.startDate, 'MMMM yyyy')}</span>
                        </div>
                      )}
                      {goal.timeframe && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingGoalsSummary;
