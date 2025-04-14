
import React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Loader2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { MeditationSession } from "@/services/meditationService";
import { Badge } from "@/components/ui/badge";

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
  // Get benefits as badges
  const getBenefitBadges = () => {
    const badges = [];
    
    if (session.improves_focus) badges.push('Focus');
    if (session.reduces_stress) badges.push('Stress Relief');
    if (session.promotes_calm) badges.push('Calm');
    if (session.improves_sleep) badges.push('Sleep');
    if (session.enhances_clarity) badges.push('Clarity');
    
    // If no specific benefits are marked, just return a single badge
    if (badges.length === 0) {
      return [<Badge key="general" variant="outline" className="mr-1">General</Badge>];
    }
    
    // Return badges for each benefit
    return badges.map(badge => (
      <Badge key={badge} variant="outline" className="mr-1">
        {badge}
      </Badge>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col md:flex-row md:justify-between rounded-lg border bg-card p-4 shadow-sm gap-3"
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium">{session.title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {session.duration}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{session.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {getBenefitBadges()}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        {isAuthenticated && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => onToggle(!session.is_enabled)}
            disabled={isToggling}
            title={session.is_enabled ? "Remove from favorites" : "Add to favorites"}
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
        <Button 
          size="default" 
          onClick={onPlay} 
          title="Add meditation session"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add
        </Button>
      </div>
    </motion.div>
  );
};

export default MeditationSessionItem;

