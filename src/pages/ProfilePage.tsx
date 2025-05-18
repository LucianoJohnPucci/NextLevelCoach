
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fix: Only redirect when we're sure authentication is complete and user is not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("[ProfilePage] No authenticated user found, redirecting to auth");
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || authLoading) return; // Don't fetch if still loading or no user
      
      try {
        setLoading(true);
        console.log("[ProfilePage] Fetching profile for user:", user.id);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("f_name, sms")
          .eq("id", user.id)
          .maybeSingle(); // Use maybeSingle instead of expecting an array
          
        if (error) throw error;
        
        if (!data) {
          console.log("[ProfilePage] No profile found, creating new profile");
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
        } else {
          console.log("[ProfilePage] Profile found:", data);
          setFirstName(data.f_name || "");
          setPhone(data.sms || "");
        }
      } catch (error: any) {
        console.error("[ProfilePage] Error fetching profile:", error);
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
  }, [user, toast, authLoading]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      console.log("[ProfilePage] Updating profile for user:", user.id);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          f_name: firstName,
          sms: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      const { error: authError } = await supabase.auth.updateUser({
        data: { 
          f_name: firstName, 
          sms: phone
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

  // Show a proper loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="container flex items-center justify-center py-10">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // If auth check is complete but no user, return null (will redirect via useEffect)
  if (!user) {
    return null;
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
