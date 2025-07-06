import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FreeSignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FreeSignupDialog: React.FC<FreeSignupDialogProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !password || !confirmPassword) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            marketing_opt_in: marketingOptIn,
            signup_ts: new Date().toISOString(),
          },
          emailRedirectTo: `${window.location.origin}/auth?verified=true`,
        },
      });
      if (error) throw error;

      // Optionally store extra profile details in a dedicated table (ensure it exists)
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          first_name: firstName,
          marketing_opt_in: marketingOptIn,
          signup_ts: new Date().toISOString(),
        });
      }

      toast({ title: "Success", description: "Check your email to confirm your account" });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Signup failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl">Sign Up Free</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input id="first-name" className="text-lg md:text-xl border-white/70 focus:border-white focus:ring-2 focus:ring-primary" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" className="text-lg md:text-xl border-white/70 focus:border-white focus:ring-2 focus:ring-primary" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" className="text-lg md:text-xl border-white/70 focus:border-white focus:ring-2 focus:ring-primary" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" className="text-2xl border-2 border-white focus:border-white focus:ring-2 focus:ring-primary" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="marketing" checked={marketingOptIn} onCheckedChange={(v) => setMarketingOptIn(!!v)} />
            <Label htmlFor="marketing" className="cursor-pointer select-none text-base md:text-lg">
              Inform me by email of any special deals, promotions or discounts open up
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FreeSignupDialog;
