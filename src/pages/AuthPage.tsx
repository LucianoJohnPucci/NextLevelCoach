
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

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Check if there's a password reset token
  useEffect(() => {
    const checkResetToken = async () => {
      // Check for the recovery type parameter which is sent by Supabase
      const type = searchParams.get("type");
      console.log("URL type parameter:", type);
      
      // Also check for the access_token or token parameter which indicates a reset password link
      const accessToken = searchParams.get("access_token");
      const token = searchParams.get("token");
      
      console.log("URL contains access_token:", !!accessToken);
      console.log("URL contains token:", !!token);
      
      if (type === "recovery" || accessToken || token) {
        console.log("Recovery detected, opening password reset dialog");
        setResetPasswordOpen(true);
      } else {
        console.log("No recovery parameters detected in URL");
      }
    };
    
    checkResetToken();
  }, [searchParams]);

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
      const { error, data } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      console.log("Password update response:", data);
      
      if (error) {
        console.error("Password update error:", error);
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated. You can now log in with your new password.",
      });
      
      setResetPasswordOpen(false);
      
      // Give the user feedback that their password was updated before redirecting
      setTimeout(() => {
        // Clear the URL parameters and redirect to login
        navigate("/auth");
      }, 2000);
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
