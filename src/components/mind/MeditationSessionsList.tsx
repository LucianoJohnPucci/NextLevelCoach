
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Loader2, Search, Star } from "lucide-react";
import MeditationSessionItem from "./MeditationSessionItem";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MeditationSession } from "@/services/meditationService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [favoriteFilter, setFavoriteFilter] = useState("all"); // New state for favorite filtering
  
  // Filter sessions by search query, duration and favorites
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         session.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDuration = durationFilter === "all" || 
                           (durationFilter === "short" && parseInt(session.duration) <= 10) ||
                           (durationFilter === "medium" && parseInt(session.duration) > 10 && parseInt(session.duration) <= 20) ||
                           (durationFilter === "long" && parseInt(session.duration) > 20);
    
    // Filter by favorites
    const matchesFavorites = favoriteFilter === "all" || 
                            (favoriteFilter === "favorites" && session.is_enabled);
    
    return matchesSearch && matchesDuration && matchesFavorites;
  });

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
        
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="short">Short (≤ 10 min)</SelectItem>
              <SelectItem value="medium">Medium (11-20 min)</SelectItem>
              <SelectItem value="long">Long (&gt; 20 min)</SelectItem>
            </SelectContent>
          </Select>
          
          {isAuthenticated && (
            <Select value={favoriteFilter} onValueChange={setFavoriteFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
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
          ) : filteredSessions.length === 0 ? (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p>
                {favoriteFilter === "favorites" 
                  ? "No favorite meditation sessions found" 
                  : "No meditation sessions available"}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
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
