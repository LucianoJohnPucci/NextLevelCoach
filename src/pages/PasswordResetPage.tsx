
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

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const processRecoveryToken = async () => {
      try {
        console.log("[Password Reset] Processing recovery token");
        setIsProcessing(true);

        // Get the URL fragments - check both hash and search params
        const { hash, search } = window.location;
        console.log("[Password Reset] Hash:", hash, "Search:", search);
        
        // Parse parameters from both hash and search
        const hashParams = new URLSearchParams(hash.substring(1));
        const searchParams = new URLSearchParams(search);
        
        const type = hashParams.get("type") || searchParams.get("type");
        const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token") || searchParams.get("refresh_token");
        
        console.log("[Password Reset] Parsed params:", { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
        
        if (type === "recovery" && accessToken && refreshToken) {
          console.log("[Password Reset] Valid recovery tokens found, setting session");
          
          // Set the session with the recovery tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("[Password Reset] Error setting session:", error);
            toast({
              title: "Invalid reset link",
              description: "The password reset link is invalid or has expired. Please request a new one.",
              variant: "destructive",
            });
            navigate("/auth");
            return;
          }
          
          console.log("[Password Reset] Session set successfully, showing reset dialog");
          
          // Clear the URL parameters
          window.history.replaceState({}, document.title, "/reset-password");
          
          setIsResetDialogOpen(true);
        } else {
          console.log("[Password Reset] No valid recovery parameters found");
          toast({
            title: "Invalid reset link", 
            description: "The password reset link is invalid or has expired. Please request a new one.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } catch (error) {
        console.error("[Password Reset] Error processing recovery:", error);
        toast({
          title: "Error",
          description: "There was a problem processing your password reset link.",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setIsProcessing(false);
      }
    };

    processRecoveryToken();
  }, [location, navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    try {
      setLoading(true);
      console.log("[Password Reset] Updating password");
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error("[Password Reset] Password update error:", error);
        throw error;
      }
      
      console.log("[Password Reset] Password updated successfully");
      setIsResetDialogOpen(false);
      setShowSuccessDialog(true);
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error: any) {
      console.error("[Password Reset] Error updating password:", error);
      setPasswordError(error.message || "An error occurred while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = async () => {
    try {
      console.log("[Password Reset] Completing reset process");
      await supabase.auth.signOut();
      setShowSuccessDialog(false);
      
      toast({
        title: "Password updated successfully",
        description: "Please sign in with your new password.",
      });
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("[Password Reset] Cleanup error:", error);
      navigate("/auth", { replace: true });
    }
  };

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
        <Dialog open={isResetDialogOpen} onOpenChange={() => {}}>
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
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
