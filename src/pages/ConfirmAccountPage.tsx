
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
          description: "Your account has been successfully confirmed. You can now proceed with onboarding.",
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

  const handleStartOnboarding = () => {
    navigate("/onboarding");
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Account confirmation</CardTitle>
            <CardDescription>
              {loading ? "Confirming your account..." : (
                confirmed ? "Your account has been confirmed" : "We couldn't confirm your account"
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : confirmed ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-medium">
                      To confirm your account, please click the button below.
                    </p>
                    <p className="text-green-700 mt-2 text-sm">
                      You'll be taken to our onboarding process to complete your profile setup.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium">
                      {error || "There was a problem confirming your account"}
                    </p>
                    <p className="text-red-700 mt-2 text-sm">
                      Please try again or contact <a href="mailto:support@example.com" className="underline">support@example.com</a> for assistance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center pb-6">
            {confirmed && (
              <Button
                onClick={handleStartOnboarding}
                size="lg"
                className="w-full"
              >
                Confirm account
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConfirmAccountPage;
