
import PracticeCard from "./PracticeCard";
import { Clock, Users, Heart } from "lucide-react";

interface PracticesSectionProps {
  reflectionMinutes: number;
  setReflectionMinutes: (value: number) => void;
  connectionsAttended: number;
  setConnectionsAttended: (value: number) => void;
  gratitudeDays: number;
  setGratitudeDays: (value: number) => void;
}

const PracticesSection = ({
  reflectionMinutes,
  setReflectionMinutes,
  connectionsAttended,
  setConnectionsAttended,
  gratitudeDays,
  setGratitudeDays
}: PracticesSectionProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <PracticeCard
        title="Daily Reflection"
        description="Take time to reflect on your values and principles."
        icon={Clock}
        measurementType="Time spent reflecting"
        currentValue={reflectionMinutes}
        maxValue={60}
        unit="minutes"
        delay={0.1}
        onValueChange={setReflectionMinutes}
      />
      <PracticeCard
        title="Meaningful Connections"
        description="Join community events and discussions."
        icon={Users}
        measurementType="Events attended"
        currentValue={connectionsAttended}
        maxValue={5}
        unit="events"
        delay={0.2}
        onValueChange={setConnectionsAttended}
      />
      <PracticeCard
        title="Gratitude Practice"
        description="Cultivate thankfulness for life's gifts."
        icon={Heart}
        measurementType="Thankfulness streak"
        currentValue={gratitudeDays}
        maxValue={10}
        unit="days"
        delay={0.3}
        onValueChange={setGratitudeDays}
      />
    </div>
  );
};

export default PracticesSection;
