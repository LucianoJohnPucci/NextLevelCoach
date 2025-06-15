
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, TrendingUp, TrendingDown } from "lucide-react";

interface SleepMetricsCardProps {
  averageHours?: number;
  trendPercentage?: number;
  isIncreasing?: boolean;
}

const SleepMetricsCard = ({ 
  averageHours = 7.8, 
  trendPercentage = 12, 
  isIncreasing = true 
}: SleepMetricsCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/30 border-blue-700/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white/90">Average Sleep</h3>
          <Bed className="h-5 w-5 text-blue-400" />
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">
            {averageHours.toFixed(1)}
          </div>
          <p className="text-sm text-white/70">
            Over the past 7 days
          </p>
          
          <Badge 
            variant="secondary" 
            className={`flex items-center gap-1 w-fit ${
              isIncreasing 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}
          >
            {isIncreasing ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trendPercentage}% {isIncreasing ? 'increase' : 'decrease'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepMetricsCard;
