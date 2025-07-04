import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingAnswer {
  question: string;
  answer: string;
}

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfOnboardingComplete();
    }
  }, [user]);

  const checkIfOnboardingComplete = async () => {
    try {
      const { data, error } = await supabase
        .from("onboarding_answers")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching onboarding answers:", error);
      }

      if (data) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  const questions: OnboardingAnswer[] = [
    {
      question: "What is your primary goal for the next 5 years?",
      answer: "answer_1",
    },
    {
      question: "What is one habit you want to develop in the next 3 months?",
      answer: "answer_2",
    },
    {
      question: "What is your biggest challenge right now?",
      answer: "answer_3",
    },
    {
      question: "What is one thing you are grateful for today?",
      answer: "answer_4",
    },
    {
      question: "What area of your life do you want to improve the most?",
      answer: "answer_5",
    },
    {
      question: "What is one thing you can do today to move closer to your goals?",
      answer: "answer_6",
    },
    {
      question: "What is your favorite quote or mantra?",
      answer: "answer_7",
    },
    {
      question: "What is one thing you learned recently?",
      answer: "answer_8",
    },
    {
      question: "What is one thing you want to learn?",
      answer: "answer_9",
    },
    {
      question: "What does success look like to you?",
      answer: "answer_10",
    },
  ];

  useEffect(() => {
    setProgress(Math.round(((step - 1) / questions.length) * 100));
  }, [step, questions.length]);

  const handleAnswerChange = (answerKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [answerKey]: value }));
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, questions.length + 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("onboarding_answers")
        .insert([
          {
            user_id: user.id,
            ...answers,
            signup_date: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error("Error submitting onboarding answers:", error);
        return;
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting onboarding:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container h-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
          <CardDescription>
            Help us personalize your experience by answering a few questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          {step <= questions.length ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="question">{questions[step - 1].question}</Label>
                <Textarea
                  id="question"
                  placeholder="Type your answer here..."
                  value={answers[questions[step - 1].answer] || ""}
                  onChange={(e) =>
                    handleAnswerChange(questions[step - 1].answer, e.target.value)
                  }
                />
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h2 className="text-2xl font-semibold">
                All questions answered!
              </h2>
              <p className="text-muted-foreground">
                Click submit to save your answers and start your journey.
              </p>
              <Button className="mt-4" onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? "Submitting..." : "Submit"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
