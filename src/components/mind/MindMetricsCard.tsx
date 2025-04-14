
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface MindMetricsCardProps {
  title: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  progress: number;
  description: string;
  isLoading: boolean;
  delay: number;
}

const MindMetricsCard = ({
  title,
  icon,
  value,
  unit,
  progress,
  description,
  isLoading,
  delay,
}: MindMetricsCardProps) => {
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
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {icon}
                  </div>
                  <span className="text-sm font-medium">{unit}</span>
                </div>
                <div className="text-2xl font-bold">{value}</div>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{description}</p>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MindMetricsCard;
