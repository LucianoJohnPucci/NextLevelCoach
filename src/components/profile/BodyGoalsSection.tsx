
import React from "react";
import { Input } from "@/components/ui/input";
import { ProfileSection } from "./ProfileSection";
import { ProfileFormField } from "./ProfileFormField";

interface BodyGoalsSectionProps {
  weightGoal: number | null;
  setWeightGoal: (value: number | null) => void;
  exerciseMinutesGoal: number | null;
  setExerciseMinutesGoal: (value: number | null) => void;
}

export const BodyGoalsSection: React.FC<BodyGoalsSectionProps> = ({
  weightGoal,
  setWeightGoal,
  exerciseMinutesGoal,
  setExerciseMinutesGoal
}) => {
  return (
    <ProfileSection title="Body Goals">
      <ProfileFormField id="weightGoal" label="Nutrition Calories Goal (cal/day)">
        <Input
          id="weightGoal"
          type="number"
          step="1"
          value={weightGoal || ''}
          onChange={(e) => setWeightGoal(Number(e.target.value) || null)}
          placeholder="Enter daily nutrition calories goal"
        />
      </ProfileFormField>
      
      <ProfileFormField id="exerciseMinutesGoal" label="Exercise Goal (minutes/day)">
        <Input
          id="exerciseMinutesGoal"
          type="number"
          value={exerciseMinutesGoal || ''}
          onChange={(e) => setExerciseMinutesGoal(Number(e.target.value) || null)}
          placeholder="Enter daily exercise goal"
        />
      </ProfileFormField>
    </ProfileSection>
  );
};
