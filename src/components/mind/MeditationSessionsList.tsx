
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Loader2 } from "lucide-react";
import MeditationSessionItem from "./MeditationSessionItem";
import type { MeditationSession } from "@/services/meditationService";

interface MeditationSessionsListProps {
  sessions: MeditationSession[];
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  isToggling: boolean;
  onToggleFavorite: (session: MeditationSession, enabled: boolean) => void;
  onPlayMeditation: (session: MeditationSession) => void;
}

const MeditationSessionsList = ({
  sessions,
  isAuthenticated,
  isLoading,
  isError,
  isToggling,
  onToggleFavorite,
  onPlayMeditation,
}: MeditationSessionsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Meditation Sessions
        </CardTitle>
        <CardDescription>
          Guided practices to improve focus and reduce stress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : isError ? (
            <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">
              <p>Failed to load meditation sessions</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p>No meditation sessions available</p>
            </div>
          ) : (
            sessions.map((session) => (
              <MeditationSessionItem 
                key={session.id}
                session={session}
                isAuthenticated={isAuthenticated}
                isToggling={isToggling}
                onToggle={(enabled) => onToggleFavorite(session, enabled)}
                onPlay={() => onPlayMeditation(session)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationSessionsList;
