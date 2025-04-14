
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface WaterIntakeTrackerProps {
  value: number;
  goal: number;
  onAddWater: (amount: number) => void;
}

const WaterIntakeTracker = ({ value, goal, onAddWater }: WaterIntakeTrackerProps) => {
  const [amount, setAmount] = useState(0.25); // Default water amount in liters
  const percentage = Math.min(Math.round((value / goal) * 100), 100);
  
  const handleAddWater = () => {
    onAddWater(amount);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplet className="h-5 w-5 text-sky-500" />
          Today's Water Intake
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your daily hydration.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{value.toFixed(2)}/{goal} L</span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1" 
                onClick={() => setAmount(0.25)}
              >
                0.25L
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1" 
                onClick={() => setAmount(0.5)}
              >
                0.5L
              </Button>
              <Button 
                size="sm" 
                className="gap-1" 
                onClick={handleAddWater}
              >
                <Plus className="h-4 w-4" />
                Add {amount}L
              </Button>
            </div>
          </div>
          <Progress value={percentage} className="h-2 bg-sky-100">
            <motion.div
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${percentage}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </Progress>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterIntakeTracker;
