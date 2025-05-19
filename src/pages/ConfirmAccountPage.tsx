
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

const ConfirmAccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        // Extract token from URL (Supabase appends it automatically)
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const type = searchParams.get("type");
        
        console.log("Confirming account:", { type, hasAccessToken: !!accessToken });
        
        if (!accessToken || type !== "signup") {
          console.error("Missing required parameters for confirmation");
          setError("Invalid confirmation link. Please try again or contact support.");
          setLoading(false);
          return;
        }

        // Set the session with the tokens provided in the URL
        // This effectively confirms the account
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (error) {
          console.error("Error confirming account:", error);
          throw error;
        }

        // Account confirmed successfully
        setConfirmed(true);
        
        toast({
          title: "Account confirmed!",
          description: "Your account has been successfully confirmed. Continue to complete your profile.",
        });
        
      } catch (err: any) {
        console.error("Error during confirmation:", err);
        setError(err.message || "An error occurred during account confirmation");
        
        toast({
          title: "Confirmation Failed",
          description: err.message || "There was a problem confirming your account",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, [searchParams, toast]);

  const handleContinueToOnboarding = () => {
    navigate("/onboarding");
  };

  const handleGoToLogin = () => {
    navigate("/auth");
  };

  return (
    <div className="container flex h-screen items-center justify-center bg-black text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        {loading ? (
          <Card className="border-0 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg">Verifying your account...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border border-red-800 bg-black shadow-lg">
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold">Verification Failed</h2>
              <p className="text-gray-400">{error}</p>
              <Button onClick={handleGoToLogin} variant="outline" className="mt-4">
                Return to Login
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-gray-800 bg-black shadow-lg">
            <CardContent className="flex flex-col items-center justify-center space-y-6 p-6">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-semibold">Account confirmation</h2>
              <p className="text-gray-400">
                To confirm your account, please click the button below.
              </p>
              <Button 
                onClick={handleContinueToOnboarding} 
                size="lg" 
                className="mt-6 px-8 w-full"
              >
                Confirm account
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                If you have any issue confirming your account please, contact support.
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default ConfirmAccountPage;
