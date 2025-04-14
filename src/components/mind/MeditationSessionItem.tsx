
import React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { MeditationSession } from "@/services/meditationService";

interface MeditationSessionItemProps {
  session: MeditationSession;
  isAuthenticated: boolean;
  isToggling: boolean;
  onToggle: (enabled: boolean) => void;
  onPlay: () => void;
}

const MeditationSessionItem = ({
  session,
  isAuthenticated,
  isToggling,
  onToggle,
  onPlay,
}: MeditationSessionItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{session.title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {session.duration}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{session.description}</p>
      </div>
      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onToggle(!session.is_enabled)}
            disabled={isToggling}
          >
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : session.is_enabled ? (
              <Bookmark className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button size="icon" onClick={onPlay}>
          <Play className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default MeditationSessionItem;
