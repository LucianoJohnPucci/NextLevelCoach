
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import AuthCard from "@/components/auth/AuthCard";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if user has just verified their email
        const verified = searchParams.get("verified") === "true";
        if (verified) {
          console.log("[Auth] Email verification success detected");
          setEmailVerified(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Check if user is already authenticated
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("[Auth] User is authenticated, redirecting to dashboard");
          navigate("/dashboard");
        } else {
          console.log("[Auth] No active session, showing login");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("[Auth] Initialization error:", error);
        setIsProcessing(false);
      }
    };

    initialize();
  }, [navigate, searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[Auth Event]", event, session ? "User session exists" : "No session");
        
        if (event === "SIGNED_IN" && session) {
          console.log("[Auth] User signed in, redirecting to dashboard");
          navigate("/dashboard");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleAuthSuccess = () => {
    navigate("/dashboard");
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
        
        <AuthCard onAuthSuccess={handleAuthSuccess} />
      </motion.div>
    </div>
  );
};

export default AuthPage;
