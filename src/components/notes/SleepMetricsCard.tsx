
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, TrendingUp, TrendingDown } from "lucide-react";
import { useSleepTracking } from "@/hooks/useSleepTracking";

const SleepMetricsCard = () => {
  const { averageSleep, sleepTrend, loading } = useSleepTracking();

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/30 border-blue-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-blue-400/20 rounded mb-4"></div>
            <div className="h-8 bg-blue-400/20 rounded mb-2"></div>
            <div className="h-4 bg-blue-400/20 rounded mb-2"></div>
            <div className="h-6 bg-blue-400/20 rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayHours = averageSleep ? averageSleep.toFixed(1) : "0.0";
  const trendPercentage = sleepTrend?.percentChange || 0;
  const isIncreasing = sleepTrend?.isIncreasing || false;
  const hasData = averageSleep !== null;

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/30 border-blue-700/30">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white/90">Average Sleep</h3>
          <Bed className="h-5 w-5 text-blue-400" />
        </div>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">
            {displayHours}h
          </div>
          <p className="text-sm text-white/70">
            {hasData ? "Over the past 7 days" : "No sleep data recorded"}
          </p>
          
          {sleepTrend && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepMetricsCard;
