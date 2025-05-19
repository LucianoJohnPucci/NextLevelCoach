
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [sms, setSms] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!email || !password || !firstName) {
      setFormError("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);
      
      console.log("Starting signup process for:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            f_name: firstName,
            sms: sms || null,
          },
          // Redirect to confirmation page
          emailRedirectTo: `${window.location.origin}/confirm-account`,
        },
      });
      
      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      console.log("Signup response:", data);
      
      // Check if confirmation was sent
      if (data?.user?.identities?.length === 0) {
        throw new Error("This email is already registered. Please log in instead.");
      }
      
      // Check if email confirmation is enabled in Supabase
      if (data?.user?.email_confirmed_at) {
        // Email confirmation is disabled in Supabase settings
        console.log("Email confirmation is disabled in Supabase. User is already confirmed.");
        toast({
          title: "Account created!",
          description: "Email confirmation is disabled. You can now log in.",
        });
        if (onSuccess) onSuccess();
      } else {
        // Email confirmation is enabled, show the verification message
        console.log("Verification email sent. Awaiting confirmation.");
        setEmailSent(true);
        
        toast({
          title: "Verification email sent!",
          description: "Please check your email to verify your account before logging in",
        });
      }
      
    } catch (error: any) {
      console.error("Error during signup:", error);
      
      let errorMessage = error.message || "An error occurred during sign up";
      
      // Handle Supabase specific errors with more user-friendly messages
      if (errorMessage.includes("User already registered")) {
        errorMessage = "This email is already registered. Please log in instead.";
      }
      
      setFormError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <CardContent className="space-y-4 pt-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertDescription className="ml-2 text-green-800">
            <p className="font-medium">Verification email sent!</p>
            <p className="mt-2">
              We've sent an email to <strong>{email}</strong>. Please check your inbox and click the 
              verification link to complete your registration.
            </p>
            <p className="mt-2">
              After verification, you can return here to log in.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    );
  }

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4 pt-4">
        {formError && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <AlertDescription className="ml-2 text-red-800">
              {formError}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="signup-name">First Name</Label>
          <Input 
            id="signup-name" 
            placeholder="John" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="your.email@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input 
            id="signup-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-sms">Phone (for notifications, optional)</Label>
          <Input 
            id="signup-sms" 
            type="tel" 
            placeholder="+1234567890" 
            value={sms}
            onChange={(e) => setSms(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
