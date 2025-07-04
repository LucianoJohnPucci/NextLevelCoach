import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Book, Target, Plus, MessageCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import MeditationSection from "@/components/mind/MeditationSection";
import JournalSection from "@/components/mind/JournalSection";
import { useAuth } from "@/hooks/useAuth";

const MindPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <motion.div 
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          Mind Development
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Strengthen your mental wellbeing
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Develop mindfulness, practice meditation, and journal your thoughts to build mental resilience.
        </p>
      </motion.div>

      <div className="grid gap-8">
        <MeditationSection />
        <JournalSection />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <Card className="transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Reading List
              </CardTitle>
              <CardDescription>
                Curated books for mental growth and mindfulness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/wisdom">
                  Explore Books
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Mental Goals
              </CardTitle>
              <CardDescription>
                Set and track your mental development goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/goals">
                  View Goals
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                AI Wisdom
              </CardTitle>
              <CardDescription>
                Get personalized advice and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/wisdom">
                  Chat with AI
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="mx-auto max-w-[800px] rounded-xl bg-primary/5 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Lightbulb className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-4 text-2xl font-medium">Daily Mental Practice</h2>
          <p className="mb-4 text-lg text-muted-foreground">
            "The mind is everything. What you think you become."
          </p>
          <p className="text-sm font-medium">— Buddha</p>
        </motion.div>
      </div>
    </div>
  );
};

export default MindPage;
