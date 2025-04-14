
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

export interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  progress?: number;
  progressMax?: number;
  progressUnit?: string;
  additionalText?: string;
  delay?: number;
}

export const MetricsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  progress, 
  progressMax, 
  progressUnit,
  additionalText,
  delay = 0.1 
}: MetricsCardProps) => {
  const progressPercentage = progress !== undefined && progressMax 
    ? Math.round((progress / progressMax) * 100) 
    : undefined;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
          
          {progressPercentage !== undefined && (
            <>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progressPercentage}% of daily goal ({progressMax} {progressUnit})
              </p>
            </>
          )}
          
          {additionalText && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current streak</span>
              <span className="text-xs text-green-500">{additionalText}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricsCard;
