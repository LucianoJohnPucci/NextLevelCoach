
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Activity, Heart, Utensils, Clock, Calendar, BarChart2, Plus } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WorkoutItem = ({ 
  title, 
  category, 
  duration,
  difficulty,
  favorite,
  index
}: { 
  title: string; 
  category: string; 
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  favorite: boolean;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            {duration}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>{category}</span>
          <span className="mx-2">•</span>
          <span className={`
            ${difficulty === "Easy" ? "text-green-500" : 
              difficulty === "Medium" ? "text-yellow-500" : 
              "text-red-500"}
          `}>
            {difficulty}
          </span>
        </div>
      </div>
      <Button size="default" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </motion.div>
  );
};

const MealItem = ({ 
  title, 
  description, 
  time,
  calories,
  index
}: { 
  title: string; 
  description: string; 
  time: string;
  calories: number;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="flex justify-between rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {time}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-right">
        <span className="text-sm font-medium">{calories}</span>
        <span className="text-xs text-muted-foreground"> cal</span>
      </div>
    </motion.div>
  );
};

const NutritionStat = ({ 
  label, 
  value, 
  total, 
  unit, 
  color
}: { 
  label: string; 
  value: number; 
  total: number; 
  unit: string;
  color: string;
}) => {
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

const BodyPage = () => {
  const [workoutFilter, setWorkoutFilter] = useState("all");
  
  const workouts = [
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
  
  // Filter workouts based on the selected filter
  const filteredWorkouts = workouts.filter(workout => 
    workoutFilter === "all" || (workoutFilter === "favorites" && workout.favorite)
  );
  
  const meals = [
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Steps</span>
                </div>
                <div className="text-2xl font-bold">8,246</div>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground">68% of daily goal (12,000)</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nutrition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Utensils className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Calories</span>
                </div>
                <div className="text-2xl font-bold">1,470</div>
              </div>
              <Progress value={73} className="h-2" />
              <p className="text-xs text-muted-foreground">73% of daily goal (2,000)</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Workout Streak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Days</span>
                </div>
                <div className="text-2xl font-bold">12</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Current streak</span>
                <span className="text-xs text-green-500">↑ 3 days</span>
              </div>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Today's Workouts
                  </CardTitle>
                  <CardDescription>
                    Recommended exercises for your fitness goals.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={workoutFilter} onValueChange={setWorkoutFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Show" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Workouts</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredWorkouts.length === 0 ? (
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p>
                      {workoutFilter === "favorites" 
                        ? "No favorite workouts found" 
                        : "No workouts available"}
                    </p>
                  </div>
                ) : (
                  filteredWorkouts.map((workout, index) => (
                    <WorkoutItem 
                      key={index}
                      title={workout.title}
                      category={workout.category}
                      duration={workout.duration}
                      difficulty={workout.difficulty}
                      favorite={workout.favorite}
                      index={index}
                    />
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <BarChart2 className="h-4 w-4" />
                View Workout History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition" className="mt-6">
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
                <div className="space-y-4">
                  {meals.map((meal, index) => (
                    <MealItem 
                      key={index}
                      title={meal.title}
                      description={meal.description}
                      time={meal.time}
                      calories={meal.calories}
                      index={index}
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
                  value={1470}
                  total={2000}
                  unit="cal"
                  color="bg-primary"
                />
                <NutritionStat
                  label="Protein"
                  value={82}
                  total={120}
                  unit="g"
                  color="bg-blue-500"
                />
                <NutritionStat
                  label="Carbs"
                  value={156}
                  total={250}
                  unit="g"
                  color="bg-yellow-500"
                />
                <NutritionStat
                  label="Fat"
                  value={46}
                  total={65}
                  unit="g"
                  color="bg-green-500"
                />
                <NutritionStat
                  label="Water"
                  value={1.2}
                  total={2.5}
                  unit="L"
                  color="bg-sky-500"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BodyPage;
