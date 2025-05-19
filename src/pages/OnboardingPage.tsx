
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const questions = [
  {
    id: "goals",
    question: "What are your primary goals for the next 5 years?",
    placeholder: "Share your main objectives and aspirations..."
  },
  {
    id: "habits",
    question: "What habits would you like to develop in the next 3 months?",
    placeholder: "List the habits you want to cultivate..."
  },
  {
    id: "obstacles",
    question: "What is your biggest obstacle to achieving your goals?",
    placeholder: "Describe any challenges you face..."
  },
  {
    id: "improvements",
    question: "What areas of your life would you like to improve the most?",
    placeholder: "Share which aspects you want to focus on..."
  },
  {
    id: "motivation",
    question: "What motivates you the most in life?",
    placeholder: "Tell us what drives you forward..."
  }
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setAnswers({
      ...answers,
      [questions[currentStep].id]: value,
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to complete onboarding",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      // Store answers in the onboarding_answers table
      const { error } = await supabase
        .from("onboarding_answers")
        .insert({
          user_id: user.id,
          answers: answers,
          signup_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Onboarding Complete",
        description: "Thank you for sharing your goals. Your journey starts now!",
      });

      // Redirect to dashboard or home page
      navigate("/");
    } catch (error: any) {
      console.error("Error saving onboarding answers:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error saving your answers",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Welcome to Your 5-Year Transformation Journey</CardTitle>
            <CardDescription>
              Help us customize your experience by answering a few questions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="question" className="text-lg font-medium">
                {currentQuestion.question}
              </Label>
              
              {currentQuestion.question.length > 100 ? (
                <Textarea
                  id="question"
                  className="min-h-[150px]"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
              ) : (
                <Textarea
                  id="question"
                  className="min-h-[120px]"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : currentStep === questions.length - 1 ? (
                <>
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
