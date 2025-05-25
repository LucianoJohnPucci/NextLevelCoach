
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, ExternalLink } from "lucide-react";

interface DiscordCommunityDialogProps {
  children: React.ReactNode;
}

export const DiscordCommunityDialog: React.FC<DiscordCommunityDialogProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Join Our Discord Community
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Discord server room is a valuable space for anyone committed to personal growth and philosophical exploration because it fosters a supportive community where members can share goals, track progress, and hold each other accountable in real time.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                It offers dedicated channels for daily check-ins, resource sharing, and meaningful discussions, creating an environment that motivates continuous self-improvement while encouraging thoughtful reflection and learning.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By connecting with like-minded individuals, users gain encouragement, diverse perspectives, and practical tools that make their journey toward better mental, physical, and intellectual well-being more engaging and sustainable.
              </p>
              <div className="pt-4">
                <Button 
                  asChild 
                  className="w-full"
                  size="lg"
                >
                  <a 
                    href="https://discord.gg/NS7q4knQ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Join Discord Server
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
