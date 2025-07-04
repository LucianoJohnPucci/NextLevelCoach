
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export interface GoalProgress {
  category: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

export const useGoalsProgress = (icons: Record<string, React.ReactNode>) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalProgress[]>([
    { category: "Mind", percentage: 0, icon: icons.mind, color: "#3b82f6" },
    { category: "Body", percentage: 0, icon: icons.body, color: "#ef4444" },
    { category: "Soul", percentage: 0, icon: icons.soul, color: "#8b5cf6" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

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
        const mindProgress = calculateAverageProgress(mindGoals);
        const bodyProgress = calculateAverageProgress(bodyGoals);
        const soulProgress = calculateAverageProgress(soulGoals);

        setGoals([
          { category: "Mind", percentage: mindProgress, icon: icons.mind, color: "#3b82f6" },
          { category: "Body", percentage: bodyProgress, icon: icons.body, color: "#ef4444" },
          { category: "Soul", percentage: soulProgress, icon: icons.soul, color: "#8b5cf6" },
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
  }, [user, icons]);

  return { goals, isLoading };
};

// Helper function to calculate average progress
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
