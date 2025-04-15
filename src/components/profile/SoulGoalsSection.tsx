
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileSection } from "./ProfileSection";
import { ProfileFormField } from "./ProfileFormField";

interface SoulGoalsSectionProps {
  reflectionGoal: number | null;
  setReflectionGoal: (value: number | null) => void;
  gratitudeFrequency: string;
  setGratitudeFrequency: (value: string) => void;
}

export const SoulGoalsSection: React.FC<SoulGoalsSectionProps> = ({
  reflectionGoal,
  setReflectionGoal,
  gratitudeFrequency,
  setGratitudeFrequency
}) => {
  return (
    <ProfileSection title="Soul Goals">
      <ProfileFormField id="reflectionGoal" label="Reflection Goal (minutes/day)">
        <Input
          id="reflectionGoal"
          type="number"
          value={reflectionGoal || ''}
          onChange={(e) => setReflectionGoal(Number(e.target.value) || null)}
          placeholder="Enter daily reflection goal"
        />
      </ProfileFormField>
      
      <ProfileFormField id="gratitudeFrequency" label="Gratitude Frequency">
        <Select 
          value={gratitudeFrequency} 
          onValueChange={(value) => setGratitudeFrequency(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gratitude frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </ProfileFormField>
    </ProfileSection>
  );
};
