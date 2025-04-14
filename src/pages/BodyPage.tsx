
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Activity, Utensils, Calendar } from "lucide-react";
import { useState } from "react";
import MetricsCard from "@/components/body/MetricsCard";
import WorkoutsSection from "@/components/body/WorkoutsSection";
import NutritionSection from "@/components/body/NutritionSection";
import { Workout } from "@/components/body/WorkoutsSection";
import { Meal } from "@/components/body/NutritionSection";

const BodyPage = () => {
  const [workoutMinutes, setWorkoutMinutes] = useState(45);
  const workoutGoal = 120;
  
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
  
  const handleAddWorkout = (minutes: number) => {
    setWorkoutMinutes(prev => prev + minutes);
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
          Tools and resources for physical health and wellness.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricsCard 
          title="Daily Activity"
          value={workoutMinutes}
          icon={Activity}
          progress={workoutMinutes}
          progressMax={workoutGoal}
          progressUnit="min"
          delay={0.1}
        />
        
        <MetricsCard 
          title="Nutrition"
          value="1,470"
          icon={Utensils}
          progress={73}
          progressMax={2000}
          progressUnit="cal"
          delay={0.2}
        />
        
        <MetricsCard 
          title="Workout Streak"
          value={12}
          icon={Calendar}
          additionalText="↑ 3 days"
          delay={0.3}
        />
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
          <NutritionSection meals={meals} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BodyPage;
