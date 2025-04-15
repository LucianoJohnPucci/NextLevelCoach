
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { MindGoalsSection } from "@/components/profile/MindGoalsSection";
import { BodyGoalsSection } from "@/components/profile/BodyGoalsSection";
import { SoulGoalsSection } from "@/components/profile/SoulGoalsSection";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [meditationGoal, setMeditationGoal] = useState<number | null>(null);
  const [focusGoal, setFocusGoal] = useState<number | null>(null);
  
  const [weightGoal, setWeightGoal] = useState<number | null>(null);
  const [exerciseMinutesGoal, setExerciseMinutesGoal] = useState<number | null>(null);
  
  const [reflectionGoal, setReflectionGoal] = useState<number | null>(null);
  const [gratitudeFrequency, setGratitudeFrequency] = useState<string>("");

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("f_name, sms, mind_meditation_goal, mind_focus_goal, body_weight_goal, body_exercise_minutes_goal, soul_reflection_goal, soul_gratitude_frequency")
          .eq("id", user.id);
          
        if (error) throw error;
        
        if (!data || data.length === 0) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              f_name: user.user_metadata?.f_name || "",
              sms: user.user_metadata?.sms || "",
              updated_at: new Date().toISOString()
            });
            
          if (insertError) throw insertError;
          
          setFirstName(user.user_metadata?.f_name || "");
          setPhone(user.user_metadata?.sms || "");
          
          setMeditationGoal(user.user_metadata?.mind_meditation_goal || null);
          setFocusGoal(user.user_metadata?.mind_focus_goal || null);
          
          setWeightGoal(user.user_metadata?.body_weight_goal || null);
          setExerciseMinutesGoal(user.user_metadata?.body_exercise_minutes_goal || null);
          
          setReflectionGoal(user.user_metadata?.soul_reflection_goal || null);
          setGratitudeFrequency(user.user_metadata?.soul_gratitude_frequency || "");
        } else {
          const profile = data[0];
          setFirstName(profile.f_name || "");
          setPhone(profile.sms || "");
          
          setMeditationGoal(profile.mind_meditation_goal || null);
          setFocusGoal(profile.mind_focus_goal || null);
          
          setWeightGoal(profile.body_weight_goal || null);
          setExerciseMinutesGoal(profile.body_exercise_minutes_goal || null);
          
          setReflectionGoal(profile.soul_reflection_goal || null);
          setGratitudeFrequency(profile.soul_gratitude_frequency || "");
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          f_name: firstName,
          sms: phone,
          
          mind_meditation_goal: meditationGoal,
          mind_focus_goal: focusGoal,
          
          body_weight_goal: weightGoal,
          body_exercise_minutes_goal: exerciseMinutesGoal,
          
          soul_reflection_goal: reflectionGoal,
          soul_gratitude_frequency: gratitudeFrequency,
          
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          f_name: firstName, 
          sms: phone,
          
          mind_meditation_goal: meditationGoal,
          mind_focus_goal: focusGoal,
          
          body_weight_goal: weightGoal,
          body_exercise_minutes_goal: exerciseMinutesGoal,
          
          soul_reflection_goal: reflectionGoal,
          soul_gratitude_frequency: gratitudeFrequency
        }
      });
      
      if (authError) throw authError;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="container py-10">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect to auth page via useEffect
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdateProfile}>
            <CardContent className="space-y-4">
              <PersonalInfoSection 
                user={user}
                firstName={firstName}
                setFirstName={setFirstName}
                phone={phone}
                setPhone={setPhone}
              />

              <MindGoalsSection 
                meditationGoal={meditationGoal}
                setMeditationGoal={setMeditationGoal}
                focusGoal={focusGoal}
                setFocusGoal={setFocusGoal}
              />

              <BodyGoalsSection 
                weightGoal={weightGoal}
                setWeightGoal={setWeightGoal}
                exerciseMinutesGoal={exerciseMinutesGoal}
                setExerciseMinutesGoal={setExerciseMinutesGoal}
              />

              <SoulGoalsSection 
                reflectionGoal={reflectionGoal}
                setReflectionGoal={setReflectionGoal}
                gratitudeFrequency={gratitudeFrequency}
                setGratitudeFrequency={setGratitudeFrequency}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
