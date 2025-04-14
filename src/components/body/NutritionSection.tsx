
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils, Plus, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MealItem from "./MealItem";
import NutritionStat from "./NutritionStat";
import WaterIntakeTracker from "./WaterIntakeTracker";

export interface Meal {
  title: string;
  description: string;
  time: string;
  calories: number;
}

export interface NutritionSectionProps {
  meals: Meal[];
  onAddCalories: (calories: number) => void;
  onAddWater: (amount: number) => void;
  nutritionStats: {
    calories: { value: number; total: number };
    protein: { value: number; total: number };
    carbs: { value: number; total: number };
    fat: { value: number; total: number };
    water: { value: number; total: number };
  };
}

export const NutritionSection = ({ meals, onAddCalories, onAddWater, nutritionStats }: NutritionSectionProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Today's Meals
              </CardTitle>
              <CardDescription>
                Track your nutrition and meal plan.
              </CardDescription>
            </div>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Meal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <WaterIntakeTracker 
            value={nutritionStats.water.value} 
            goal={nutritionStats.water.total} 
            onAddWater={onAddWater}
          />
          <div className="space-y-4">
            {meals.map((meal, index) => (
              <MealItem 
                key={index}
                title={meal.title}
                description={meal.description}
                time={meal.time}
                calories={meal.calories}
                index={index}
                onAddCalories={onAddCalories}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            Nutrition Summary
          </CardTitle>
          <CardDescription>
            Daily nutrients breakdown.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <NutritionStat
            label="Calories"
            value={nutritionStats.calories.value}
            total={nutritionStats.calories.total}
            unit="cal"
            color="bg-primary"
          />
          <NutritionStat
            label="Protein"
            value={nutritionStats.protein.value}
            total={nutritionStats.protein.total}
            unit="g"
            color="bg-blue-500"
          />
          <NutritionStat
            label="Carbs"
            value={nutritionStats.carbs.value}
            total={nutritionStats.carbs.total}
            unit="g"
            color="bg-yellow-500"
          />
          <NutritionStat
            label="Fat"
            value={nutritionStats.fat.value}
            total={nutritionStats.fat.total}
            unit="g"
            color="bg-green-500"
          />
          <NutritionStat
            label="Water"
            value={nutritionStats.water.value}
            total={nutritionStats.water.total}
            unit="L"
            color="bg-sky-500"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionSection;
