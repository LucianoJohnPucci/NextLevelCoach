
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

type Question = {
  id: string;
  text: string;
  placeholder: string;
};

const questions: Question[] = [
  {
    id: "focus",
    text: "What is your primary focus for self-improvement right now (e.g., physical health, mental clarity, emotional balance, or spiritual growth)?",
    placeholder: "Share your main focus area for self-improvement..."
  },
  {
    id: "habit",
    text: "What specific habit would you like to build or break in the next 60 days to improve your body, mind, or spirit?",
    placeholder: "Describe a habit you want to develop or break..."
  },
  {
    id: "measurable_goal",
    text: "Describe one measurable goal you want to achieve in the next 1-2 years to enhance your overall well-being.",
    placeholder: "Share a specific, measurable goal..."
  },
  {
    id: "ideal_self",
    text: "What does your ideal self look like in 5 years, considering your physical health, mental state, and spiritual fulfillment?",
    placeholder: "Describe your vision of your ideal future self..."
  },
  {
    id: "challenges",
    text: "What challenges or obstacles have prevented you from achieving your self-improvement goals in the past?",
    placeholder: "Share what has blocked your progress previously..."
  },
  {
    id: "time_commitment",
    text: "How much time can you realistically commit each day or week to working on your body, mind, or spirit goals?",
    placeholder: "Describe your available time commitment..."
  },
  {
    id: "motivation",
    text: "What motivates you most to improve yourself (e.g., better health, personal growth, relationships, or inner peace)?",
    placeholder: "Share what drives your desire for self-improvement..."
  },
  {
    id: "practices",
    text: "Are there specific practices (e.g., meditation, exercise, journaling) you already do or want to incorporate into your routine?",
    placeholder: "List practices you currently do or want to start..."
  },
  {
    id: "satisfaction",
    text: "How would you rate your current satisfaction with your physical health, mental well-being, and spiritual life on a scale of 1-10?",
    placeholder: "Share your ratings and brief explanation..."
  },
  {
    id: "support",
    text: "What kind of support do you hope to receive from the app's AI (e.g., daily reminders, personalized plans, progress tracking)",
    placeholder: "Describe what support would be most helpful..."
  }
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<{answer: string}>();

  const handleNext = () => {
    // Get the current answer
    const currentAnswer = form.getValues().answer || "";
    
    // Save the answer
    setAnswers({
      ...answers,
      [questions[currentStep].id]: currentAnswer
    });
    
    // Move to next question or submit if last question
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      // Reset form value for next question
      form.reset({ answer: "" });
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      // Get the current answer before moving back
      const currentAnswer = form.getValues().answer || "";
      
      // Save the current answer
      setAnswers({
        ...answers,
        [questions[currentStep].id]: currentAnswer
      });
      
      // Move to previous question
      setCurrentStep(currentStep - 1);
      
      // Set form value to the previous answer
      form.setValue("answer", answers[questions[currentStep - 1].id] || "");
    }
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
      // Prepare data for database insertion with questions as well
      const questionAnswerPairs: Record<string, string> = {};
      
      questions.forEach((question, index) => {
        const answerKey = question.id;
        questionAnswerPairs[`question_${index + 1}`] = question.text;
        questionAnswerPairs[`answer_${index + 1}`] = answers[answerKey] || "";
      });

      // Store answers in the onboarding_answers table
      const { error } = await supabase
        .from("onboarding_answers")
        .insert({
          user_id: user.id,
          ...questionAnswerPairs,
        });

      if (error) throw error;

      toast({
        title: "Onboarding Complete",
        description: "Thank you for sharing your goals. Your journey begins now!",
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

  // If answer for current question exists in state, populate the form
  React.useEffect(() => {
    form.setValue("answer", answers[currentQuestion.id] || "");
  }, [currentStep, currentQuestion.id]);

  return (
    <div className="container mx-auto py-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="border shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Your 5-Year Transformation Journey</CardTitle>
            <CardDescription>
              Help us personalize your experience by answering a few questions
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
            
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-medium">
                        {currentQuestion.text}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={currentQuestion.placeholder}
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
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
