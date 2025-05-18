
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for the recovery parameters first, before any session checks
    const type = searchParams.get("type");
    const accessToken = searchParams.get("access_token");
    
    console.log("URL type parameter:", type);
    console.log("URL contains access_token:", !!accessToken);
    
    if (type === "recovery" || accessToken) {
      console.log("Password recovery flow detected - showing reset dialog");
      setResetPasswordOpen(true);
      
      // We don't want to check for sessions in recovery flow because
      // we don't want automatic login to happen
      return;
    }
    
    // Only check session if not in recovery flow
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();
  }, [navigate, searchParams]);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event detected:", event);
        
        // Check for password recovery event
        if (event === "PASSWORD_RECOVERY") {
          console.log("Password recovery event detected");
          setResetPasswordOpen(true);
          return; // Don't proceed further for password recovery
        }
        
        // Check if we should ignore the session due to being in recovery flow
        const type = searchParams.get("type");
        const accessToken = searchParams.get("access_token");
        const isRecoveryFlow = type === "recovery" || accessToken;
        
        // Only auto-redirect if we're not in recovery flow and have a session
        if (session && !isRecoveryFlow && !resetPasswordOpen) {
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams, resetPasswordOpen]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      console.log("Attempting to update password");
      
      // Update password using the Supabase API
      // This will use the token from the URL automatically
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error("Password update error:", error);
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated. You can now log in with your new password.",
      });
      
      setResetPasswordOpen(false);
      
      // Sign out the user after password reset to force them to log in again with new password
      await supabase.auth.signOut();
      
      // Clear the URL parameters and redirect to login
      navigate("/auth");
    } catch (error: any) {
      console.error("Error during password reset:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while resetting your password. Please try again or request a new reset link.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    navigate("/");
  };

  return (
    <>
      <div className="container flex h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <AuthCard onAuthSuccess={handleAuthSuccess} />
        </motion.div>
      </div>
      
      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleResetPassword}>
            <DialogHeader>
              <DialogTitle>Set new password</DialogTitle>
              <DialogDescription>
                Enter and confirm your new password below.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthPage;
