
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { X, Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import welcomeAudio from "@/assets/audio/onboarding/welcome.mp3";

interface CustomPlanDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CustomPlanDialog: React.FC<CustomPlanDialogProps> = ({ 
  children, 
  open, 
  onOpenChange 
}) => {
  const { isPlaying, toggle } = useAudio(welcomeAudio, { autoplay: true });

  // Play audio when dialog opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        if (!isPlaying) {
          toggle();
        }
      }, 500);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
        <DialogHeader className="relative">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-medium text-white">
                Personalize Your Journey
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Answer these questions to help us create your custom 5-year transformation plan.
              </DialogDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggle} 
              className="text-white hover:bg-slate-800"
              title={isPlaying ? "Mute audio" : "Play audio"}
            >
              {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Question 1 of 10</span>
              <span>10%</span>
            </div>
            <Progress value={10} className="h-2 bg-slate-700" />
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="goal" className="text-lg font-medium text-white">
              What is your primary goal for the next 5 years?
            </Label>
            
            <Input
              id="goal"
              placeholder="Your answer..."
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              disabled
              className="bg-transparent border-slate-600 text-slate-400 cursor-not-allowed"
            >
              Previous
            </Button>
            
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
