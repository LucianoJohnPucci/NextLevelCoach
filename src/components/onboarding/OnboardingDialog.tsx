
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "./useOnboarding";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultQuestions = [
  "What is your primary goal for the next 5 years?",
  "What habits would you like to develop in the next 3 months?",
  "What is your biggest obstacle to achieving your goals?",
  "How would you rate your current wellness on a scale of 1-10 and why?",
  "What areas of your life would you like to improve the most?",
  "How much time can you dedicate daily to your personal development?",
  "What previous methods have you tried that didn't work for you?",
  "What strengths do you bring to your personal development journey?",
  "What motivates you the most in life?",
  "What would success look like for you at the end of this coaching journey?"
];

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { saveAnswers, getUserAnswers } = useOnboarding();

  useEffect(() => {
    if (open && user) {
      // Load existing answers if available
      const loadAnswers = async () => {
        setIsLoading(true);
        try {
          const existingAnswers = await getUserAnswers();
          if (existingAnswers) {
            const loadedAnswers: Record<string, string> = {};
            for (let i = 1; i <= 10; i++) {
              const answer = existingAnswers[`answer_${i}`];
              if (answer) {
                loadedAnswers[`${i}`] = answer;
              }
            }
            setAnswers(loadedAnswers);
          }
        } catch (error) {
          console.error("Error loading answers:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadAnswers();
    }
  }, [open, user]);

  const handleNext = () => {
    if (currentStep < defaultQuestions.length - 1) {
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
      [`${currentStep + 1}`]: value,
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your answers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formattedAnswers: Record<string, string> = {};

      // Format answers for saving
      for (let i = 1; i <= 10; i++) {
        formattedAnswers[`question_${i}`] = defaultQuestions[i - 1];
        formattedAnswers[`answer_${i}`] = answers[`${i}`] || "";
      }

      await saveAnswers(formattedAnswers);

      toast({
        title: "Success",
        description: "Your answers have been saved. We'll use them to customize your experience.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving answers:", error);
      toast({
        title: "Error",
        description: "There was an error saving your answers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentStep + 1) / defaultQuestions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Personalize Your Journey</DialogTitle>
          <DialogDescription>
            Answer these questions to help us create your custom 5-year transformation plan.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentStep + 1} of {defaultQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="question" className="text-lg font-medium">
                {defaultQuestions[currentStep]}
              </Label>
              
              {defaultQuestions[currentStep].length > 100 ? (
                <Textarea
                  id="question"
                  className="min-h-[150px]"
                  placeholder="Your answer..."
                  value={answers[`${currentStep + 1}`] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
              ) : (
                <Input
                  id="question"
                  placeholder="Your answer..."
                  value={answers[`${currentStep + 1}`] || ""}
                  onChange={(e) => handleInputChange(e.target.value)}
                />
              )}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
              >
                {currentStep === defaultQuestions.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
