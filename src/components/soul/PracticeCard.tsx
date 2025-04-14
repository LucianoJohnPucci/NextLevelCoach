
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

interface PracticeCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  measurementType: string;
  currentValue: number;
  maxValue: number;
  unit: string;
  delay: number;
  onValueChange: (value: number) => void;
}

const PracticeCard = ({ 
  title, 
  description, 
  icon: Icon, 
  measurementType,
  currentValue,
  maxValue,
  unit,
  delay,
  onValueChange
}: PracticeCardProps) => {
  const progressPercentage = Math.round((currentValue / maxValue) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="h-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="mb-2 w-fit rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="p-6 pt-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{measurementType}</span>
            <span className="font-semibold">
              {currentValue} / {maxValue} {unit}
            </span>
          </div>
          <Slider 
            value={[currentValue]} 
            max={maxValue} 
            step={1}
            disabled={true}
            className="cursor-default"
          />
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage}% complete
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PracticeCard;
