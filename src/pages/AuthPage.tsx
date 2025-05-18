
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // PRIORITY 1: Check for password reset parameters and sign out any existing session
  useEffect(() => {
    const handleRecoveryFlow = async () => {
      // Check all possible parameters that indicate a recovery flow
      const type = searchParams.get("type");
      const accessToken = searchParams.get("access_token");
      const hash = window.location.hash;
      
      // Check for reset token in hash (format: #access_token=xxx&type=recovery)
      const hashParams = new URLSearchParams(hash.replace('#', ''));
      const hashType = hashParams.get("type");
      const hashAccessToken = hashParams.get("access_token");
      
      const isRecoveryFlow = 
        type === "recovery" || 
        accessToken || 
        hashType === "recovery" || 
        hashAccessToken;
      
      console.log("[Password Recovery] Recovery detection:", {
        urlType: type,
        urlAccessToken: !!accessToken,
        hashType,
        hashAccessToken: !!hashAccessToken,
        isRecoveryFlow
      });
      
      // If this is a recovery flow, ALWAYS sign out first
      if (isRecoveryFlow) {
        console.log("[Password Recovery] Recovery flow detected - signing out user immediately");
        setIsSigningOut(true);
        
        try {
          // Force sign out all sessions to ensure clean state
          await supabase.auth.signOut({ scope: 'global' });
          console.log("[Password Recovery] User signed out successfully before showing reset dialog");
          
          // After signing out, show the reset dialog
          setResetPasswordOpen(true);
          setIsAuthCheckComplete(true);
          setIsSigningOut(false);
          return true; // Recovery flow detected, return true
        } catch (error) {
          console.error("[Password Recovery] Error during sign out before showing reset dialog:", error);
          toast({
            title: "Error",
            description: "There was a problem preparing for password reset. Please try again.",
            variant: "destructive",
          });
          setIsAuthCheckComplete(true);
          setIsSigningOut(false);
          return true; // Still consider it a recovery flow even if there was an error
        }
      }
      
      setIsSigningOut(false);
      return false; // Not a recovery flow
    };

    // Only check regular session if not in recovery flow
    handleRecoveryFlow().then(isRecoveryFlow => {
      if (!isRecoveryFlow && !isSigningOut) {
        const checkSession = async () => {
          try {
            const { data } = await supabase.auth.getSession();
            
            if (data.session) {
              navigate("/");
            }
            setIsAuthCheckComplete(true);
          } catch (error) {
            console.error("[Auth] Session check error:", error);
            setIsAuthCheckComplete(true);
          }
        };
        
        checkSession();
      }
    });
  }, [navigate, searchParams, toast, isSigningOut]);

  // Set up auth state listener to detect PASSWORD_RECOVERY events
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Password Recovery] Auth event detected:", event);
        
        // Only handle PASSWORD_RECOVERY event if the reset dialog isn't already open
        if (event === "PASSWORD_RECOVERY" && !resetPasswordOpen) {
          console.log("[Password Recovery] PASSWORD_RECOVERY event detected - signing out first");
          setIsSigningOut(true);
          
          try {
            // Always sign out first - use global scope to terminate all sessions
            await supabase.auth.signOut({ scope: 'global' });
            console.log("[Password Recovery] User signed out successfully after PASSWORD_RECOVERY event");
            
            // Then show reset dialog
            setResetPasswordOpen(true);
          } catch (error) {
            console.error("[Password Recovery] Error during sign out after PASSWORD_RECOVERY event:", error);
            toast({
              title: "Error",
              description: "There was a problem preparing for password reset. Please try again.",
              variant: "destructive",
            });
          } finally {
            setIsSigningOut(false);
          }
          return;
        }
        
        // Check if we should ignore the session due to being in recovery flow
        const type = searchParams.get("type");
        const accessToken = searchParams.get("access_token");
        const hash = window.location.hash;
        const hashParams = new URLSearchParams(hash.replace('#', ''));
        const isRecoveryFlow = 
          type === "recovery" || 
          accessToken || 
          hashParams.get("type") === "recovery" || 
          hashParams.get("access_token");
        
        // Only auto-redirect if we're not in recovery flow, not actively signing out,
        // not showing the reset password dialog, and password isn't just updated
        if (session && 
            !isRecoveryFlow && 
            !resetPasswordOpen && 
            !isPasswordUpdated && 
            !isSigningOut) {
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams, resetPasswordOpen, isPasswordUpdated, toast, isSigningOut]);

  // Handle password reset submission
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
      
      // Mark password as updated to avoid redirect loops
      setIsPasswordUpdated(true);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated. Please log in with your new password.",
      });
      
      // Clear the form
      setNewPassword("");
      setConfirmPassword("");
      setResetPasswordOpen(false);
      
      console.log("[Password Recovery] Password updated successfully, signing out user");
      
      // Sign out again after password reset to ensure clean state
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear URL parameters and redirect to login
      console.log("[Password Recovery] Redirecting to login page");
      
      // Clear any URL parameters by replacing the current location
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Finally navigate to the auth page (which will show login form since user is signed out)
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

  // Handle dialog closing - ensure we clean up properly
  const handleDialogChange = async (open: boolean) => {
    if (!open && resetPasswordOpen) {
      try {
        // Sign out when manually closing the dialog
        console.log("[Password Recovery] Reset dialog closing, signing out user");
        await supabase.auth.signOut({ scope: 'global' });
        
        // Clear URL parameters by replacing the current location
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        // Navigate to the clean auth page
        navigate("/auth", { replace: true });
      } catch (error) {
        console.error("[Password Recovery] Error during sign out when closing reset dialog:", error);
      } finally {
        setResetPasswordOpen(false);
      }
    } else {
      setResetPasswordOpen(open);
    }
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
          {isAuthCheckComplete && !isSigningOut && <AuthCard onAuthSuccess={handleAuthSuccess} />}
        </motion.div>
      </div>
      
      {/* Reset Password Dialog */}
      <Dialog 
        open={resetPasswordOpen} 
        onOpenChange={handleDialogChange}
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
