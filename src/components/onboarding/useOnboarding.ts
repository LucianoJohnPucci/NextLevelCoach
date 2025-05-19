
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const useOnboarding = () => {
  const { user } = useAuth();

  /**
   * Fetch the user's onboarding answers
   */
  const getUserAnswers = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("onboarding_answers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is the error code for "No rows returned"
      console.error("Error fetching user onboarding answers:", error);
      throw error;
    }

    return data;
  };

  /**
   * Save answers to the onboarding_answers table
   */
  const saveAnswers = async (questionAnswerPairs: Record<string, string>) => {
    if (!user) throw new Error("User must be logged in");

    const existingAnswers = await getUserAnswers();

    if (existingAnswers) {
      // Update existing answers
      const { error } = await supabase
        .from("onboarding_answers")
        .update(questionAnswerPairs)
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
            ...questionAnswerPairs,
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
