
import React, { useState, useEffect } from "react";
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
  const [profileExists, setProfileExists] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return; // Don't fetch if no user, but DON'T redirect
      
      try {
        setLoading(true);
        console.log("[ProfilePage] Fetching profile for user:", user.id);
        
        // First, check if the profile exists
        const { data, error } = await supabase
          .from("profiles")
          .select("f_name, sms")
          .eq("id", user.id)
          .maybeSingle();
          
        if (error) {
          console.error("[ProfilePage] Error checking profile:", error);
          // Don't throw here, just log the error
        }
        
        if (data) {
          // Profile exists, set the data
          console.log("[ProfilePage] Profile found:", data);
          setProfileExists(true);
          setFirstName(data.f_name || "");
          setPhone(data.sms || "");
        } else {
          console.log("[ProfilePage] No profile found, using user metadata");
          // No profile found, use metadata from auth user
          setProfileExists(false);
          setFirstName(user.user_metadata?.f_name || "");
          setPhone(user.user_metadata?.sms || "");
        }
      } catch (error: any) {
        console.error("[ProfilePage] Error in profile fetch flow:", error);
        // Show toast but don't redirect
        toast({
          title: "Warning",
          description: "Could not load complete profile data. Some information may be missing.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchProfile();
    }
  }, [user, toast, authLoading]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      console.log("[ProfilePage] Updating profile for user:", user.id);
      
      // Only attempt to update the profile in the database if it exists
      if (profileExists) {
        const { error } = await supabase
          .from("profiles")
          .update({
            f_name: firstName,
            sms: phone,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
          
        if (error) throw error;
      }
      
      // Always update the user metadata in auth
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
      console.error("[ProfilePage] Error updating profile:", error);
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

  // If no user is available but auth check is complete, show a login prompt
  // instead of redirecting
  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be logged in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please sign in to access your profile information.</p>
          </CardContent>
        </Card>
      </div>
    );
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
