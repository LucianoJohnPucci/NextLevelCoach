import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FreeSignupDialog from "@/components/auth/FreeSignupDialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    name: "Free Plan",
    features: [
      { icon: "📊", text: "Database recording" },
      { icon: "💬", text: "Discord membership" },
      { icon: "📧", text: "Email progress reporting" },
      { icon: "🗓️", text: "60 Day New Habit Challenge" },
    ],
    cta: "Sign Up Free",
    highlight: false,
  },
  {
    name: "Forge Plan",
    features: [
      { icon: "✅", text: "Everything in Free Plan" },
      { icon: "🤖", text: "Unlimited tokens with 2 Ai Agents" },
      { icon: "🎯", text: "Future Goal Ai Optimization" },
      { icon: "🥗", text: "Nutrition Planner" },
      { icon: "📝", text: "Custom Goal Ai Planning" },
    ],
    cta: "Start Forge Plan",
    highlight: true,
  },
];

const SignUp: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-12">Choose Your Membership</h1>
      <div className="flex flex-col md:flex-row gap-12">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative w-full sm:w-[26rem] md:w-[32rem] px-6 py-8 border-primary border-2 flex flex-col ${plan.highlight ? 'shadow-lg' : ''}`}>
            {plan.name === "Forge Plan" && (
            <span className="absolute -top-3 -right-3 bg-primary text-white text-sm md:text-base font-semibold px-3 py-1 rounded-full shadow-lg">
              $9.99/mo
            </span>
          )}
          <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-center mb-4">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <ul className="mb-8 space-y-4 text-lg md:text-xl">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <span>{feature.text}</span>
                </li>
                ))}
              </ul>

              {plan.name === "Free Plan" && (
                <p className="italic text-sm md:text-base text-muted-foreground mb-6">When you're ready to unlock your full potential with the Forge Plan, your valuable progress data—including goals and performance statistics—seamlessly carries over, ensuring zero disruption to your success journey.</p>
              )}

              {plan.name === "Forge Plan" && (
                <div className="flex items-center justify-center gap-3 mb-6 mt-4">
                  <Switch id="forge-annual" />
                  <label htmlFor="forge-annual" className="text-sm md:text-base select-none">Annual</label>
                </div>
              )}
              {plan.name === "Free Plan" ? (
                <Button size="lg" className="w-full text-lg md:text-xl py-6 mt-auto" variant="default" onClick={() => setDialogOpen(true)}>
                  {plan.cta}
                </Button>
              ) : (
                <Button size="lg" className="w-full text-lg md:text-xl py-6 mt-auto" variant="default">
                  {plan.cta}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="italic text-base md:text-lg text-center mt-10 mx-auto max-w-3xl">Your privacy is our priority. All personal data is protected with enterprise-grade security and remains completely under your control.</p>
      <FreeSignupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default SignUp;
