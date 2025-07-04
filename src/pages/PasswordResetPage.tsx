
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        console.log("[Password Reset] Starting password reset process");
        setIsProcessing(true);

        // Get URL parameters from both hash and search
        const { hash, search } = window.location;
        console.log("[Password Reset] URL hash:", hash, "search:", search);
        
        const hashParams = new URLSearchParams(hash.substring(1));
        const searchParams = new URLSearchParams(search);
        
        const type = hashParams.get("type") || searchParams.get("type");
        const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token") || searchParams.get("refresh_token");
        
        console.log("[Password Reset] Found parameters:", { 
          type, 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken 
        });
        
        if (type === "recovery" && accessToken && refreshToken) {
          console.log("[Password Reset] Valid recovery link detected");
          
          // Set the session for password reset
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("[Password Reset] Session error:", error);
            toast({
              title: "Invalid reset link",
              description: "The password reset link is invalid or expired. Please request a new one.",
              variant: "destructive",
            });
            navigate("/auth");
            return;
          }
          
          console.log("[Password Reset] Recovery session established successfully");
          
          // Clean URL and show password form
          window.history.replaceState({}, document.title, "/reset-password");
          setIsResetDialogOpen(true);
        } else {
          console.log("[Password Reset] Invalid or missing recovery parameters");
          toast({
            title: "Invalid reset link",
            description: "This password reset link is invalid or expired. Please request a new one.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } catch (error) {
        console.error("[Password Reset] Error:", error);
        toast({
          title: "Error",
          description: "Something went wrong with the password reset process.",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setIsProcessing(false);
      }
    };

    handlePasswordReset();
  }, [navigate, toast]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
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
        console.error("[Password Reset] Update error:", error);
        setPasswordError(error.message || "Failed to update password");
        return;
      }
      
      console.log("[Password Reset] Password updated successfully");
      setIsResetDialogOpen(false);
      setShowSuccessDialog(true);
      
    } catch (error: any) {
      console.error("[Password Reset] Unexpected error:", error);
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      console.log("[Password Reset] Completing process - signing out");
      
      // Sign out to clear the recovery session
      await supabase.auth.signOut();
      
      setShowSuccessDialog(false);
      
      toast({
        title: "Password updated!",
        description: "Your password has been changed. Please sign in with your new password.",
      });
      
      // Go to login page
      navigate("/auth", { replace: true });
      
    } catch (error) {
      console.error("[Password Reset] Error during completion:", error);
      navigate("/auth", { replace: true });
    }
  };

  if (isProcessing) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Processing your password reset...</p>
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
        {/* Password Reset Form Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handlePasswordUpdate}>
              <DialogHeader>
                <DialogTitle>Create New Password</DialogTitle>
                <DialogDescription>
                  Enter your new password below.
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
                    placeholder="Enter new password"
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
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                </div>
                
                {passwordError && (
                  <div className="text-sm text-destructive">
                    {passwordError}
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Updating Password..." : "Update Password"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={() => {}}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Password Updated!</AlertDialogTitle>
              <AlertDialogDescription>
                Your password has been successfully changed. Click continue to sign in with your new password.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={handleComplete}>
                Continue to Sign In
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
};

export default PasswordResetPage;
