
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
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  // FIRST priority: Sign out any existing session if we detect password reset parameters
  useEffect(() => {
    const checkForRecoveryFlow = async () => {
      // Check parameters that indicate a recovery flow
      const type = searchParams.get("type");
      const accessToken = searchParams.get("access_token");
      
      console.log("[Password Recovery] URL type parameter:", type);
      console.log("[Password Recovery] URL contains access_token:", !!accessToken);
      
      // If this is a recovery flow, ALWAYS sign out first and then show the reset dialog
      if (type === "recovery" || accessToken) {
        console.log("[Password Recovery] Recovery flow detected - signing out first");
        
        try {
          // Force sign out FIRST to ensure clean state
          await supabase.auth.signOut();
          console.log("[Password Recovery] User signed out successfully");
          
          // THEN show the dialog
          setResetPasswordOpen(true);
          setIsAuthCheckComplete(true);
          return true;
        } catch (error) {
          console.error("[Password Recovery] Error during sign out:", error);
          setIsAuthCheckComplete(true);
          return true;
        }
      }
      return false;
    };

    // Only check session if not in recovery flow
    checkForRecoveryFlow().then(isRecoveryFlow => {
      if (!isRecoveryFlow) {
        const checkSession = async () => {
          try {
            const { data } = await supabase.auth.getSession();
            
            if (data.session) {
              navigate("/");
            }
            setIsAuthCheckComplete(true);
          } catch (error) {
            console.error("[Password Recovery] Session check error:", error);
            setIsAuthCheckComplete(true);
          }
        };
        
        checkSession();
      }
    });
  }, [navigate, searchParams]);

  // Set up auth state listener to detect PASSWORD_RECOVERY events
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Password Recovery] Auth event detected:", event);
        
        // Check for password recovery event
        if (event === "PASSWORD_RECOVERY") {
          console.log("[Password Recovery] PASSWORD_RECOVERY event detected - signing out first");
          
          try {
            // Always sign out first
            await supabase.auth.signOut();
            console.log("[Password Recovery] User signed out successfully after PASSWORD_RECOVERY event");
            
            // Then show reset dialog
            setResetPasswordOpen(true);
            return; // Don't proceed further for password recovery
          } catch (error) {
            console.error("[Password Recovery] Error during sign out after PASSWORD_RECOVERY event:", error);
          }
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
      
      console.log("[Password Recovery] Attempting to update password");
      
      // Update password using the Supabase API
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error("[Password Recovery] Password update error:", error);
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated. Please log in with your new password.",
      });
      
      // Clear the form and close the dialog
      setNewPassword("");
      setConfirmPassword("");
      setResetPasswordOpen(false);
      
      // Important: Sign out the user after password reset
      // This ensures they need to log in with their new password
      console.log("[Password Recovery] Password updated successfully, signing out user");
      await supabase.auth.signOut();
      
      // Clear the URL parameters and redirect to login
      console.log("[Password Recovery] Redirecting to login page");
      navigate("/auth", { replace: true });
      
    } catch (error: any) {
      console.error("[Password Recovery] Error during password reset:", error);
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
          {isAuthCheckComplete && <AuthCard onAuthSuccess={handleAuthSuccess} />}
        </motion.div>
      </div>
      
      {/* Reset Password Dialog */}
      <Dialog 
        open={resetPasswordOpen} 
        onOpenChange={async (open) => {
          // If user is trying to close the dialog manually, sign them out first
          if (!open && resetPasswordOpen) {
            try {
              console.log("[Password Recovery] Dialog closing, signing out user");
              await supabase.auth.signOut();
              setResetPasswordOpen(false);
              // Clear URL params when closing the dialog
              navigate("/auth", { replace: true });
            } catch (error) {
              console.error("[Password Recovery] Error during sign out when closing dialog:", error);
              setResetPasswordOpen(false);
              navigate("/auth", { replace: true });
            }
          } else {
            setResetPasswordOpen(open);
          }
        }}
      >
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
