
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Heart, Sparkles, Target, BarChart2, Calendar, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import LandingPage from "@/components/landing/LandingPage";
import { useState } from "react";
import OnboardingDialog from "@/components/onboarding/OnboardingDialog";
import GoalsProgress from "@/components/goals/GoalsProgress";
import OnboardingGoalsSummary from "@/components/goals/OnboardingGoalsSummary";

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  delay 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  to: string; 
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={to}>
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/20">
          <CardContent className="p-6">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-medium">{title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center text-sm font-medium text-primary">
              Explore <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const AuthenticatedHome = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const features = [
    {
      title: "Mind",
      description: "Mental exercises, meditation guides, and personal journaling.",
      icon: Brain,
      to: "/mind",
      delay: 0.1
    },
    {
      title: "Body",
      description: "Workout routines, nutrition tips, and health scheduling tools.",
      icon: Heart,
      to: "/body",
      delay: 0.2
    },
    {
      title: "Soul",
      description: "Inspirational content, spiritual exercises, and community.",
      icon: Sparkles,
      to: "/soul",
      delay: 0.3
    },
    {
      title: "Daily Input",
      description: "Log your mood, accomplishments, and reflections for the day.",
      icon: Calendar,
      to: "/daily",
      delay: 0.4
    },
    {
      title: "Dashboard",
      description: "Visualize your mood trends and track your progress over time.",
      icon: BarChart2,
      to: "/dashboard",
      delay: 0.5
    },
    {
      title: "Goals & Habits",
      description: "Set meaningful goals and build lasting positive habits.",
      icon: Target,
      to: "/goals",
      delay: 0.6
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      <motion.div 
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Welcome to Next Level Coach
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Nurture your mind, body, and soul
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Track your mental wellbeing, build healthy habits, and access wisdom to guide your journey.
        </p>
      </motion.div>

      {/* Buttons moved up directly under the title section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <Button asChild size="lg">
          <Link to="/daily">Start Today's Input</Link>
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => setShowOnboarding(true)}
        >
          Custom Plan Building
        </Button>
      </motion.div>

      {/* Onboarding Goals Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <OnboardingGoalsSummary />
      </motion.div>

      {/* Goals Progress Graph moved below OnboardingGoalsSummary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GoalsProgress />
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      <motion.div 
        className="mx-auto max-w-[800px] rounded-xl bg-primary/5 p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="mb-4 text-2xl font-medium">Daily Wisdom</h2>
        <p className="mb-4 text-lg italic text-muted-foreground">
          "The happiness of your life depends upon the quality of your thoughts."
        </p>
        <p className="text-sm font-medium">— Marcus Aurelius</p>
      </motion.div>
      
      {/* Onboarding Dialog */}
      <OnboardingDialog 
        open={showOnboarding} 
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
};

const Index = () => {
  const { user } = useAuth();

  // Show landing page for non-authenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show authenticated home for logged in users
  return <AuthenticatedHome />;
};

export default Index;
