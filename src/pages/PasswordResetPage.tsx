
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Component state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [recoveryToken, setRecoveryToken] = useState<string | null>(null);
  const [recoveryType, setRecoveryType] = useState<string | null>(null);

  // Process the reset token on component mount
  useEffect(() => {
    const processRecoveryToken = async () => {
      try {
        console.log("[Password Reset] Page mounted, checking for recovery parameters");
        setIsProcessing(true);

        // Force sign out first thing to ensure clean state
        console.log("[Password Reset] Signing out all sessions");
        await supabase.auth.signOut({ scope: 'global' });
        
        // Check all possible locations for the recovery token
        // 1. Hash parameters (primary Supabase approach)
        const { hash } = window.location;
        const cleanHash = hash.startsWith('#') ? hash.substring(1) : hash;
        const hashParams = new URLSearchParams(cleanHash);
        
        // 2. URL search parameters (fallback)
        const searchParams = new URLSearchParams(location.search);
        
        // Get type and token from all possible sources
        const type = hashParams.get("type") || searchParams.get("type");
        const token = hashParams.get("access_token") || searchParams.get("access_token");
        
        console.log("[Password Reset] Parameters detected:", { 
          type, 
          hasToken: !!token,
          hash,
          url: window.location.href
        });
        
        // If we found recovery parameters, show the reset dialog
        if (type === "recovery" && token) {
          setRecoveryToken(token);
          setRecoveryType(type);
          setIsResetDialogOpen(true);
          console.log("[Password Reset] Valid recovery flow detected, showing password reset dialog");
        } else if (hash.includes("type=recovery") || hash.includes("access_token")) {
          // Try to parse from raw hash if URLSearchParams failed
          console.log("[Password Reset] Recovery parameters detected in hash but couldn't parse normally");
          setIsResetDialogOpen(true);
        } else {
          // No recovery parameters found, redirect to auth page
          console.log("[Password Reset] No recovery parameters found, redirecting to auth page");
          toast({
            title: "Invalid reset link",
            description: "The password reset link is invalid or has expired.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } catch (error) {
        console.error("[Password Reset] Error processing recovery token:", error);
        toast({
          title: "Error",
          description: "There was a problem processing your password reset link.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processRecoveryToken();
  }, [location, navigate, toast]);

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
      
      console.log("[Password Reset] Updating password");
      
      // Update password using the Supabase API
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error("[Password Reset] Password update error:", error);
        throw error;
      }
      
      console.log("[Password Reset] Password updated successfully");
      
      // Close reset dialog and show success
      setIsResetDialogOpen(false);
      setShowSuccessDialog(true);
      
      // Clear the form
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error: any) {
      console.error("[Password Reset] Error during password reset:", error);
      setPasswordError(error.message || "An error occurred while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  // After successful password reset
  const handleSuccessDialogClose = async () => {
    try {
      console.log("[Password Reset] Reset completed, cleaning up");
      
      // Sign out again to ensure clean state
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setShowSuccessDialog(false);
      
      // Navigate to auth page
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("[Password Reset] Final cleanup error:", error);
      navigate("/auth", { replace: true });
    }
  };

  // Prevent closing the reset dialog manually (must complete or navigate away)
  const handleDialogChange = (open: boolean) => {
    if (!open && isResetDialogOpen) {
      // Don't allow closing the dialog manually during the reset process
      // User must either complete the flow or refresh/navigate away
      return;
    }
    setIsResetDialogOpen(open);
  };

  // Loading state
  if (isProcessing) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Processing password reset request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Reset Password Dialog */}
        <Dialog 
          open={isResetDialogOpen} 
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
      </motion.div>
    </div>
  );
};

export default PasswordResetPage;
