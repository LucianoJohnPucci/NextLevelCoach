import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from "./useOnboarding";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

interface OnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

interface OnboardingQuestion {
  id: string;
  question: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  placeholder: string;
}

const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "question_1",
    question: "What's your primary goal for personal development?",
    type: "select",
    options: ["Improve physical health", "Enhance mental clarity", "Develop spiritual practices", "Build better habits", "Increase productivity"],
    placeholder: "Select your primary goal"
  },
  {
    id: "question_2", 
    question: "What time of day do you feel most productive?",
    type: "select",
    options: ["Early morning (5-8 AM)", "Morning (8-11 AM)", "Afternoon (12-5 PM)", "Evening (5-8 PM)", "Night (8-11 PM)"],
    placeholder: "Select your productive time"
  },
  {
    id: "question_3",
    question: "How many minutes can you realistically dedicate to daily practices?",
    type: "select", 
    options: ["10-15 minutes", "15-30 minutes", "30-45 minutes", "45-60 minutes", "More than 60 minutes"],
    placeholder: "Select your available time"
  },
  {
    id: "question_4",
    question: "What's your biggest challenge in maintaining healthy habits?",
    type: "textarea",
    placeholder: "Describe your main challenge..."
  },
  {
    id: "question_5",
    question: "What does success look like for you in 3 months?",
    type: "textarea", 
    placeholder: "Describe your vision of success..."
  }
];

const OnboardingDialog = ({ isOpen, onClose, onComplete }: OnboardingDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { saveAnswers } = useOnboarding();
  const { playAudio } = useAudio();

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      playAudio('/assets/audio/onboarding/welcome.mp3');
    }
  }, [isOpen, currentStep, playAudio]);

  const handleNext = () => {
    if (currentStep < onboardingQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      playAudio('/assets/audio/onboarding/welcome2.mp3');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your onboarding answers.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create question-answer pairs
      const questionAnswerPairs: Record<string, string> = {};
      onboardingQuestions.forEach((q, index) => {
        questionAnswerPairs[`question_${index + 1}`] = q.question;
        questionAnswerPairs[`answer_${index + 1}`] = answers[q.id] || '';
      });

      await saveAnswers(questionAnswerPairs);
      
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your personalized journey starts now.",
      });
      
      onComplete?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your answers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = onboardingQuestions[currentStep];
  const progress = ((currentStep + 1) / onboardingQuestions.length) * 100;
  const isCurrentAnswered = answers[currentQuestion?.id];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Welcome to Your Journey</CardTitle>
            </div>
            <CardDescription>
              Let's personalize your experience with a few quick questions
            </CardDescription>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Question {currentStep + 1} of {onboardingQuestions.length}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-center">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.type === "select" && (
                  <Select
                    value={answers[currentQuestion.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={currentQuestion.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQuestion.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {currentQuestion.type === "text" && (
                  <Input
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="text-center"
                  />
                )}

                {currentQuestion.type === "textarea" && (
                  <Textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="min-h-[100px]"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep === onboardingQuestions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isCurrentAnswered || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentAnswered}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingDialog;
