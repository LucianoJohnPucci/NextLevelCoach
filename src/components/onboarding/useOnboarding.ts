
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const useOnboarding = () => {
  const { user } = useAuth();

  const getUserAnswers = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user onboarding answers:", error);
      throw error;
    }

    return data;
  };

  const saveAnswers = async (answers: Record<string, string>) => {
    if (!user) throw new Error("User must be logged in");

    const existingAnswers = await getUserAnswers();

    if (existingAnswers) {
      // Update existing answers
      const { error } = await supabase
        .from("onboarding_answers")
        .update({
          ...answers,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating onboarding answers:", error);
        throw error;
      }
    } else {
      // Insert new answers
      const { error } = await supabase
        .from("onboarding_answers")
        .insert([
          {
            user_id: user.id,
            ...answers,
          },
        ]);

      if (error) {
        console.error("Error inserting onboarding answers:", error);
        throw error;
      }
    }

    return true;
  };

  return {
    getUserAnswers,
    saveAnswers,
  };
};
