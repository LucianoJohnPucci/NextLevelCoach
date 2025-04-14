
import { Progress } from "@/components/ui/progress";

export interface NutritionStatProps {
  label: string;
  value: number;
  total: number;
  unit: string;
  color: string;
}

export const NutritionStat = ({ 
  label, 
  value, 
  total, 
  unit, 
  color
}: NutritionStatProps) => {
  const percentage = Math.min(Math.round((value / total) * 100), 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {value}/{total} {unit}
        </span>
      </div>
      <Progress value={percentage} className={color} />
    </div>
  );
};

export default NutritionStat;
