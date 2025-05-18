
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Component state 
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  
  // Use refs to track critical state across rerenders
  const recoveryDetectedRef = useRef(false);
  const processStartedRef = useRef(false);
  
  // CRITICAL: This function runs before authentication checks
  const checkForRecoveryFlow = () => {
    // Don't run this more than once
    if (processStartedRef.current) return false;
    processStartedRef.current = true;
    
    // Check URL hash (primary method Supabase uses)
    const hash = window.location.hash;
    const fullUrl = window.location.href;
    
    // Log for debugging
    console.log("[Password Recovery] URL check:", {
      hash,
      pathname: location.pathname,
      fullUrl
    });
    
    // Direct detection instead of parsing - more reliable
    const isRecoveryFlow = 
      hash.includes("type=recovery") || 
      hash.includes("access_token") ||
      fullUrl.includes("type=recovery") ||
      fullUrl.includes("access_token") ||
      location.pathname.includes("reset-password");
    
    recoveryDetectedRef.current = isRecoveryFlow;
    
    console.log("[Password Recovery] Is recovery flow detected:", isRecoveryFlow);
    return isRecoveryFlow;
  };
  
  // Main initialization effect - runs once on component mount
  useEffect(() => {
    // Check if user has just verified their email
    const verified = searchParams.get("verified") === "true";
    if (verified) {
      console.log("[Auth] Email verification success detected");
      setEmailVerified(true);
      
      // Update URL without the query parameter to avoid repeated state
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Immediately check if this is a recovery flow
    const isRecoveryFlow = checkForRecoveryFlow();
    
    const initialize = async () => {
      try {
        if (isRecoveryFlow) {
          console.log("[Password Recovery] Recovery flow detected - Processing...");
          
          // CRITICAL: Force sign out ALL sessions immediately
          console.log("[Password Recovery] Signing out all sessions");
          await supabase.auth.signOut({ scope: 'global' });
          
          // Add delay to ensure sign out completes
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Double-check the session was cleared
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.warn("[Password Recovery] WARNING: Session still exists after sign out");
            await supabase.auth.signOut({ scope: 'global' });
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          console.log("[Password Recovery] Setting up password reset dialog");
          setResetPasswordOpen(true);
          setIsAuthCheckComplete(true);
          setIsProcessing(false);
        } else {
          // Normal auth flow - check if user is authenticated
          console.log("[Auth] Checking user session");
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log("[Auth] User is authenticated, redirecting to home");
            navigate("/");
          } else {
            console.log("[Auth] No active session, showing login");
            setIsAuthCheckComplete(true);
            setIsProcessing(false);
          }
        }
      } catch (error) {
        console.error("[Auth] Initialization error:", error);
        setIsAuthCheckComplete(true);
        setIsProcessing(false);
      }
    };
    
    initialize();
    
    // Only run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Listen for Supabase auth events in a separate effect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Auth Event]", event, session ? "User session exists" : "No session");
        
        // Handle email confirmation events
        if (event === "USER_UPDATED" || event === "SIGNED_IN") {
          // Check if the user has confirmed their email
          if (session?.user?.email_confirmed_at) {
            console.log("[Auth] Email confirmed, user is verified");
            // User has confirmed email, they can now log in
          }
        }
        
        // Handle PASSWORD_RECOVERY event from Supabase
        if (event === "PASSWORD_RECOVERY") {
          console.log("[Password Recovery] PASSWORD_RECOVERY event detected");
          
          // Prevent handling if already showing reset dialog
          if (resetPasswordOpen || isPasswordUpdated) {
            console.log("[Password Recovery] Reset dialog already open, ignoring event");
            return;
          }
          
          try {
            // Always sign out first
            await supabase.auth.signOut({ scope: 'global' });
            await new Promise(resolve => setTimeout(resolve, 500));
            
            console.log("[Password Recovery] Showing password reset dialog");
            setResetPasswordOpen(true);
          } catch (error) {
            console.error("[Password Recovery] Error during PASSWORD_RECOVERY handling:", error);
            toast({
              title: "Error",
              description: "There was a problem preparing for password reset.",
              variant: "destructive",
            });
          }
          return;
        }
        
        // Handle user login events, but not during password reset
        if (event === "SIGNED_IN" && !recoveryDetectedRef.current && !resetPasswordOpen) {
          console.log("[Auth] User signed in, redirecting to home");
          navigate("/");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, resetPasswordOpen, isPasswordUpdated, toast]);

  // Handle password reset submission
  const handleResetPassword = async (e) => {
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
      
      console.log("[Password Recovery] Updating password");
      
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
      
    } catch (error) {
      console.error("[Password Recovery] Error during password reset:", error);
      setPasswordError(error.message || "An error occurred while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  // After successful password reset
  const handleSuccessDialogClose = async () => {
    try {
      console.log("[Password Recovery] Reset completed, cleaning up");
      
      // Sign out again to ensure clean state
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setShowSuccessDialog(false);
      
      // Hard refresh to auth page for cleanest state
      window.location.href = "/auth";
    } catch (error) {
      console.error("[Password Recovery] Final cleanup error:", error);
      setShowSuccessDialog(false);
      navigate("/auth", { replace: true });
    }
  };

  const handleAuthSuccess = () => {
    navigate("/");
  };

  // Handle manual dialog closing
  const handleDialogChange = async (open) => {
    if (!open && resetPasswordOpen) {
      try {
        // Sign out when manually closing the dialog
        console.log("[Password Recovery] Dialog manually closed, signing out");
        await supabase.auth.signOut({ scope: 'global' });
        
        // Clean URL and reload
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.href = "/auth";
      } catch (error) {
        console.error("[Password Recovery] Dialog close cleanup error:", error);
      } finally {
        setResetPasswordOpen(false);
      }
    } else {
      setResetPasswordOpen(open);
    }
  };

  // Loading state
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
          {emailVerified && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="text-green-800">Email verified!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your email has been verified. You can now log in to your account.
              </AlertDescription>
            </Alert>
          )}
          
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
