
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
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // STEP 1: Immediately check for recovery flow before anything else happens
  useEffect(() => {
    const detectRecoveryAndSignOut = async () => {
      setIsProcessing(true);
      
      // Check for recovery indicators in URL query params and hash
      const type = searchParams.get("type");
      const accessToken = searchParams.get("access_token");
      const hash = window.location.hash;
      const hashParams = new URLSearchParams(hash.replace('#', ''));
      const hashType = hashParams.get("type");
      const hashAccessToken = hashParams.get("access_token");
      
      // Determine if this is a recovery flow from any source
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
      
      // If this is a recovery flow, ALWAYS sign out first before anything else
      if (isRecoveryFlow) {
        console.log("[Password Recovery] Recovery flow detected - signing out user immediately");
        
        try {
          // Force sign out all sessions to ensure clean state
          await supabase.auth.signOut({ scope: 'global' });
          console.log("[Password Recovery] User signed out successfully");
          
          // After signing out, show the reset dialog
          setResetPasswordOpen(true);
          setIsAuthCheckComplete(true);
          setIsProcessing(false);
          return true; // Recovery flow handled
        } catch (error) {
          console.error("[Password Recovery] Error during sign out before showing reset dialog:", error);
          toast({
            title: "Error",
            description: "There was a problem preparing for password reset. Please try again.",
            variant: "destructive",
          });
          setIsAuthCheckComplete(true);
          setIsProcessing(false);
          return true; // Still consider it handled even if there was an error
        }
      }
      
      setIsProcessing(false);
      return false; // Not a recovery flow
    };

    // Only proceed to check session if it's not a recovery flow
    detectRecoveryAndSignOut().then(isRecoveryFlow => {
      if (!isRecoveryFlow) {
        const checkSession = async () => {
          try {
            const { data } = await supabase.auth.getSession();
            
            // If user is already authenticated and not in recovery flow, redirect to home
            if (data.session) {
              navigate("/");
            } else {
              setIsAuthCheckComplete(true);
            }
          } catch (error) {
            console.error("[Auth] Session check error:", error);
            setIsAuthCheckComplete(true);
          }
        };
        
        checkSession();
      }
    });
  }, [navigate, searchParams, toast]);

  // Set up auth state listener to detect PASSWORD_RECOVERY events
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Password Recovery] Auth event detected:", event);
        
        // If we're already showing the reset dialog or just updated the password, don't handle login events
        if (resetPasswordOpen || isPasswordUpdated) return;
        
        // Handle PASSWORD_RECOVERY event
        if (event === "PASSWORD_RECOVERY") {
          console.log("[Password Recovery] PASSWORD_RECOVERY event detected - signing out first");
          
          try {
            // Always sign out first to ensure a clean state
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
          }
          return;
        }
        
        // Only auto-redirect on login if we're not in a recovery flow or password reset process
        if (session && !resetPasswordOpen && !isPasswordUpdated) {
          // Check if this might be a recovery flow via URL
          const type = searchParams.get("type");
          const hash = window.location.hash;
          const hashParams = new URLSearchParams(hash.replace('#', ''));
          const isRecoveryFlow = 
            type === "recovery" || 
            hashParams.get("type") === "recovery";
          
          // Only redirect to home if definitely not in recovery flow
          if (!isRecoveryFlow) {
            navigate("/");
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, searchParams, resetPasswordOpen, isPasswordUpdated, toast]);

  // Handle password reset submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    // Validate password
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    // Validate password confirmation match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
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
      
      console.log("[Password Recovery] Password updated successfully");
      
      // Mark password as updated to avoid redirect loops
      setIsPasswordUpdated(true);
      setResetPasswordOpen(false);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Clear the form
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error: any) {
      console.error("[Password Recovery] Error during password reset:", error);
      setPasswordError(error.message || "An error occurred while resetting your password. Please try again or request a new reset link.");
    } finally {
      setLoading(false);
    }
  };

  // After successful password reset and success dialog is closed
  const handleSuccessDialogClose = async () => {
    try {
      console.log("[Password Recovery] Signing out after password reset");
      
      // Sign out again after password reset to ensure clean state
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear URL parameters and redirect to login
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      setShowSuccessDialog(false);
      
      // Force reload to ensure clean state
      window.location.href = "/auth";
    } catch (error) {
      console.error("[Password Recovery] Error during sign out after password reset:", error);
      setShowSuccessDialog(false);
      navigate("/auth", { replace: true });
    }
  };

  const handleAuthSuccess = () => {
    navigate("/");
  };

  // Handle reset dialog closing - ensure we clean up properly
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
        window.location.href = "/auth";
      } catch (error) {
        console.error("[Password Recovery] Error during sign out when closing reset dialog:", error);
      } finally {
        setResetPasswordOpen(false);
      }
    } else {
      setResetPasswordOpen(open);
    }
  };

  if (isProcessing) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Preparing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container flex h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {isAuthCheckComplete && !resetPasswordOpen && <AuthCard onAuthSuccess={handleAuthSuccess} />}
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
              
              {passwordError && (
                <div className="text-sm font-medium text-destructive">
                  {passwordError}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Updated Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your password has been changed. You'll need to sign in with your new password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleSuccessDialogClose}>
              Continue to Login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AuthPage;
