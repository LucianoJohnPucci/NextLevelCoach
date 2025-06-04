
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Activity, Utensils, Calendar, Dumbbell, Heart, Zap, StretchHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WorkoutsSection from "@/components/body/WorkoutsSection";
import NutritionSection from "@/components/body/NutritionSection";
import { Workout } from "@/components/body/WorkoutsSection";
import { Meal } from "@/components/body/NutritionSection";

const BodyPage = () => {
  const [sitUpsCount, setSitUpsCount] = useState(0);
  const [pushUpsCount, setPushUpsCount] = useState(0);
  const [benchPressCount, setBenchPressCount] = useState(0);
  const [armCurlsCount, setArmCurlsCount] = useState(0);
  
  const [nutritionStats, setNutritionStats] = useState({
    calories: { value: 0, total: 2000 },
    protein: { value: 0, total: 120 },
    carbs: { value: 0, total: 250 },
    fat: { value: 0, total: 65 },
    water: { value: 0, total: 2.5 }
  });
  
  const initialWorkouts: Workout[] = [
    {
      title: "Morning Yoga",
      category: "Flexibility",
      duration: "20 min",
      difficulty: "Easy" as const,
      favorite: true
    },
    {
      title: "HIIT Cardio",
      category: "Cardio",
      duration: "30 min",
      difficulty: "Hard" as const,
      favorite: false
    },
    {
      title: "Strength Training",
      category: "Strength",
      duration: "45 min",
      difficulty: "Medium" as const,
      favorite: true
    },
    {
      title: "Evening Stretch",
      category: "Recovery",
      duration: "15 min",
      difficulty: "Easy" as const,
      favorite: false
    }
  ];
  
  const meals: Meal[] = [
    {
      title: "Breakfast",
      description: "Oatmeal with fruits and nuts",
      time: "7:30 AM",
      calories: 320
    },
    {
      title: "Lunch",
      description: "Grilled chicken salad with avocado",
      time: "12:30 PM",
      calories: 450
    },
    {
      title: "Snack",
      description: "Greek yogurt with honey",
      time: "3:30 PM",
      calories: 180
    },
    {
      title: "Dinner",
      description: "Salmon with quinoa and vegetables",
      time: "7:00 PM",
      calories: 520
    }
  ];
  
  const handleSitUpsClick = () => {
    const newCount = sitUpsCount + 1;
    setSitUpsCount(newCount);
    toast.success("Sit-ups set recorded!");
  };
  
  const handlePushUpsClick = () => {
    const newCount = pushUpsCount + 1;
    setPushUpsCount(newCount);
    toast.success("Push-ups set recorded!");
  };
  
  const handleBenchPressClick = () => {
    const newCount = benchPressCount + 1;
    setBenchPressCount(newCount);
    toast.success("Bench press set recorded!");
  };
  
  const handleArmCurlsClick = () => {
    const newCount = armCurlsCount + 1;
    setArmCurlsCount(newCount);
    toast.success("Arm curls set recorded!");
  };
  
  const handleAddWorkout = (minutes: number) => {
    toast.success(`Added ${minutes} minutes to your workout`);
  };
  
  const handleAddCalories = (calories: number) => {
    setNutritionStats(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        value: prev.calories.value + calories
      },
      // Also update other nutrients based on simple estimates
      protein: {
        ...prev.protein,
        value: prev.protein.value + Math.round(calories * 0.15 / 4) // 15% protein, 4 cal per gram
      },
      carbs: {
        ...prev.carbs,
        value: prev.carbs.value + Math.round(calories * 0.55 / 4) // 55% carbs, 4 cal per gram
      },
      fat: {
        ...prev.fat,
        value: prev.fat.value + Math.round(calories * 0.3 / 9) // 30% fat, 9 cal per gram
      }
    }));
    toast.success(`Added ${calories} calories to your nutrition tracking`);
  };
  
  const handleAddWater = (amount: number) => {
    setNutritionStats(prev => ({
      ...prev,
      water: {
        ...prev.water,
        value: parseFloat((prev.water.value + amount).toFixed(2))
      }
    }));
    toast.success(`Added ${amount}L of water to your daily intake`);
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Body</h1>
        <p className="text-muted-foreground">
          Track your daily gym exercises and nutrition.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleSitUpsClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-orange-100 p-3 text-orange-600">
                <Activity className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Sit-ups</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {sitUpsCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sets completed today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSitUpsClick();
                }}
              >
                + Add Set
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handlePushUpsClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-red-100 p-3 text-red-600">
                <Zap className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Push-ups</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                {pushUpsCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sets completed today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePushUpsClick();
                }}
              >
                + Add Set
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleBenchPressClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-blue-100 p-3 text-blue-600">
                <Dumbbell className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Bench Press</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {benchPressCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sets completed today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBenchPressClick();
                }}
              >
                + Add Set
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={handleArmCurlsClick}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-fit rounded-lg bg-green-100 p-3 text-green-600">
                <Heart className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Arm Curls</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {armCurlsCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sets completed today
              </p>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleArmCurlsClick();
                }}
              >
                + Add Set
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workouts">
            <Activity className="mr-2 h-4 w-4" />
            Workouts
          </TabsTrigger>
          <TabsTrigger value="nutrition">
            <Utensils className="mr-2 h-4 w-4" />
            Nutrition
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workouts" className="mt-6">
          <WorkoutsSection 
            initialWorkouts={initialWorkouts} 
            onAddWorkout={handleAddWorkout} 
          />
        </TabsContent>
        
        <TabsContent value="nutrition" className="mt-6">
          <NutritionSection 
            meals={meals} 
            onAddCalories={handleAddCalories}
            onAddWater={handleAddWater}
            nutritionStats={nutritionStats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BodyPage;
