import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFirstName(data.f_name || "");
          setPhone(data.sms || "");
          
          setMeditationGoal(data.mind_meditation_goal || null);
          setFocusGoal(data.mind_focus_goal || null);
          
          setWeightGoal(data.body_weight_goal || null);
          setExerciseMinutesGoal(data.body_exercise_minutes_goal || null);
          
          setReflectionGoal(data.soul_reflection_goal || null);
          setGratitudeFrequency(data.soul_gratitude_frequency || "");
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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone for SMS Notifications</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Mind Goals</h3>
                <div className="space-y-2">
                  <Label htmlFor="meditationGoal">Meditation Goal (minutes/day)</Label>
                  <Input
                    id="meditationGoal"
                    type="number"
                    value={meditationGoal || ''}
                    onChange={(e) => setMeditationGoal(Number(e.target.value) || null)}
                    placeholder="Enter daily meditation goal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="focusGoal">Focus Goal (hours/day)</Label>
                  <Input
                    id="focusGoal"
                    type="number"
                    value={focusGoal || ''}
                    onChange={(e) => setFocusGoal(Number(e.target.value) || null)}
                    placeholder="Enter daily focus goal"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Body Goals</h3>
                <div className="space-y-2">
                  <Label htmlFor="weightGoal">Weight Goal (kg)</Label>
                  <Input
                    id="weightGoal"
                    type="number"
                    step="0.1"
                    value={weightGoal || ''}
                    onChange={(e) => setWeightGoal(Number(e.target.value) || null)}
                    placeholder="Enter weight goal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exerciseMinutesGoal">Exercise Goal (minutes/day)</Label>
                  <Input
                    id="exerciseMinutesGoal"
                    type="number"
                    value={exerciseMinutesGoal || ''}
                    onChange={(e) => setExerciseMinutesGoal(Number(e.target.value) || null)}
                    placeholder="Enter daily exercise goal"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Soul Goals</h3>
                <div className="space-y-2">
                  <Label htmlFor="reflectionGoal">Reflection Goal (minutes/day)</Label>
                  <Input
                    id="reflectionGoal"
                    type="number"
                    value={reflectionGoal || ''}
                    onChange={(e) => setReflectionGoal(Number(e.target.value) || null)}
                    placeholder="Enter daily reflection goal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gratitudeFrequency">Gratitude Frequency</Label>
                  <Select 
                    value={gratitudeFrequency} 
                    onValueChange={(value) => setGratitudeFrequency(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gratitude frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
