
import React from "react";
import { Input } from "@/components/ui/input";
import { ProfileSection } from "./ProfileSection";
import { ProfileFormField } from "./ProfileFormField";

interface MindGoalsSectionProps {
  meditationGoal: number | null;
  setMeditationGoal: (value: number | null) => void;
  focusGoal: number | null;
  setFocusGoal: (value: number | null) => void;
}

export const MindGoalsSection: React.FC<MindGoalsSectionProps> = ({
  meditationGoal,
  setMeditationGoal,
  focusGoal,
  setFocusGoal
}) => {
  return (
    <ProfileSection title="Mind Goals">
      <ProfileFormField id="meditationGoal" label="Meditation Goal (minutes/day)">
        <Input
          id="meditationGoal"
          type="number"
          value={meditationGoal || ''}
          onChange={(e) => setMeditationGoal(Number(e.target.value) || null)}
          placeholder="Enter daily meditation goal"
        />
      </ProfileFormField>
      
      <ProfileFormField id="focusGoal" label="Focus Goal (hours/day)">
        <Input
          id="focusGoal"
          type="number"
          value={focusGoal || ''}
          onChange={(e) => setFocusGoal(Number(e.target.value) || null)}
          placeholder="Enter daily focus goal"
        />
      </ProfileFormField>
    </ProfileSection>
  );
};
