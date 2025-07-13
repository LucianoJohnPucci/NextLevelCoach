import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Brain, Handshake } from "lucide-react";
// import { supabase } from "@/supabaseClient"; // uncomment once tables exist

interface CardProps {
  title: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  onIncrement: () => void;
  buttonLabel: string;
}

const StatCard: React.FC<CardProps> = ({ title, count, color, icon, onIncrement, buttonLabel }) => (
  <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm w-full sm:w-64">
    <div
      className="flex h-10 w-10 items-center justify-center rounded-md"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {icon}
    </div>
    <h3 className="mt-4 text-sm font-medium text-foreground text-center">{title}</h3>
    <p className="mt-2 text-3xl font-bold" style={{ color }}>
      {count}
    </p>
    <p className="text-xs text-muted-foreground mb-4">Times today</p>
    <Button size="sm" onClick={onIncrement} variant="outline" style={{ borderColor: color, color }}>
      + {buttonLabel}
    </Button>
  </div>
);

const SoulPage: React.FC = () => {
  // session counters
  const [meditation, setMeditation] = useState(0);
  const [gratitude, setGratitude] = useState(0);
  const [helped, setHelped] = useState(0);

  // reflections
  const [gratitudeText, setGratitudeText] = useState("");
  const [challengesText, setChallengesText] = useState("");

  const saveSessions = async () => {
    try {
      // await supabase.from("soul_sessions").insert({ meditation, gratitude, helped, date: new Date() });
      console.log("Saved sessions", { meditation, gratitude, helped });
      // toast success
    } catch (e) {
      console.error(e);
    }
  };

  const saveReflections = async () => {
    try {
      // await supabase.from("soul_reflections").insert({ gratitudeText, challengesText, date: new Date() });
      console.log("Saved reflections", { gratitudeText, challengesText });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl space-y-8 px-4 pb-24 pt-6">
      {/* Save sessions button */}
      <div className="absolute right-4 top-4">
        <Button size="sm" onClick={saveSessions}>
          💾 Save Sessions
        </Button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Meditation Practiced"
          count={meditation}
          color="#3b82f6"
          icon={<Brain className="h-5 w-5" />}
          onIncrement={() => setMeditation((c) => c + 1)}
          buttonLabel="Add Practice"
        />
        <StatCard
          title="Daily Gratitude"
          count={gratitude}
          color="#c084fc"
          icon={<Heart className="h-5 w-5" />}
          onIncrement={() => setGratitude((c) => c + 1)}
          buttonLabel="Express Gratitude"
        />
        <StatCard
          title="Helped Someone"
          count={helped}
          color="#10b981"
          icon={<Handshake className="h-5 w-5" />}
          onIncrement={() => setHelped((c) => c + 1)}
          buttonLabel="Made Connection"
        />
      </div>

      {/* Progress banner */}
      <div className="rounded-lg bg-primary/10 p-6 text-center text-sm text-foreground">
        Keep nurturing your spiritual growth through daily practices of mindfulness, gratitude, and human connection.
      </div>

      {/* Reflections */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">Daily Reflections</h2>
        <p className="text-sm text-muted-foreground">
          Take a moment to reflect on your day with gratitude and acknowledge any challenges.
        </p>

        {/* Gratitude */}
        <div className="space-y-2 rounded-lg border p-4">
          <h3 className="flex items-center gap-2 text-base font-medium">
            <Heart className="h-4 w-4" style={{ color: '#c084fc' }} /> Gratitude
          </h3>
          <p className="text-xs text-muted-foreground">What are you grateful for today?</p>
          <Textarea
            placeholder="I'm grateful for..."
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
          />
        </div>

        {/* Challenges */}
        <div className="space-y-2 rounded-lg border p-4">
          <h3 className="flex items-center gap-2 text-base font-medium">
            📄 Challenges
          </h3>
          <p className="text-xs text-muted-foreground">What challenges did you face today?</p>
          <Textarea
            placeholder="Today I found it difficult to..."
            value={challengesText}
            onChange={(e) => setChallengesText(e.target.value)}
          />
        </div>
      </section>

      {/* Save reflections button */}
      <div className="fixed bottom-4 right-4">
        <Button onClick={saveReflections}>💾 Save Reflections</Button>
      </div>
    </div>
  );
};

export default SoulPage;
