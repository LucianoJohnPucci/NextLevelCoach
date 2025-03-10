
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { BarChart, Calendar, CheckCircle, Clock, ListTodo, Plus, Star, Target, Trash } from "lucide-react";

// Goal component
const Goal = ({ 
  goal, 
  onDelete,
  index
}: { 
  goal: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    category: string;
    completed: boolean;
  };
  onDelete: (id: string) => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{goal.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              goal.category === "mind" ? "bg-blue-100 text-blue-800" :
              goal.category === "body" ? "bg-green-100 text-green-800" :
              "bg-purple-100 text-purple-800"
            }`}>
              {goal.category}
            </span>
            {goal.completed && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                Completed
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{goal.description}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Deadline: {goal.deadline}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <CheckCircle className={`h-4 w-4 ${goal.completed ? "text-green-500" : ""}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Habit component
const Habit = ({ 
  habit, 
  onDelete,
  index
}: { 
  habit: {
    id: string;
    title: string;
    frequency: string;
    streak: number;
    category: string;
  };
  onDelete: (id: string) => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="rounded-lg border bg-card p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{habit.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs ${
              habit.category === "mind" ? "bg-blue-100 text-blue-800" :
              habit.category === "body" ? "bg-green-100 text-green-800" :
              "bg-purple-100 text-purple-800"
            }`}>
              {habit.category}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{habit.frequency}</span>
            <span>•</span>
            <Star className="h-3 w-3 text-yellow-500" />
            <span>{habit.streak} day streak</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onDelete(habit.id)}>
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <CheckCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const GoalsPage = () => {
  const [activeTab, setActiveTab] = useState("goals");
  const [goals, setGoals] = useState([
    {
      id: "1",
      title: "Read 20 pages daily",
      description: "Develop a reading habit for personal growth",
      deadline: "August 30, 2023",
      category: "mind",
      completed: false
    },
    {
      id: "2",
      title: "Complete 5K run",
      description: "Train for and complete a 5K run",
      deadline: "September 15, 2023",
      category: "body",
      completed: false
    },
    {
      id: "3",
      title: "Daily meditation practice",
      description: "Establish a daily meditation routine",
      deadline: "August 20, 2023",
      category: "soul",
      completed: true
    }
  ]);
  
  const [habits, setHabits] = useState([
    {
      id: "1",
      title: "Morning Meditation",
      frequency: "Daily",
      streak: 7,
      category: "mind"
    },
    {
      id: "2",
      title: "Workout",
      frequency: "3x per week",
      streak: 4,
      category: "body"
    },
    {
      id: "3",
      title: "Gratitude Journal",
      frequency: "Daily",
      streak: 12,
      category: "soul"
    }
  ]);
  
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    deadline: "",
    category: "mind"
  });
  
  const [newHabit, setNewHabit] = useState({
    title: "",
    frequency: "",
    category: "mind"
  });
  
  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };
  
  const handleAddGoal = () => {
    if (!newGoal.title) return;
    
    const goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      deadline: newGoal.deadline,
      category: newGoal.category,
      completed: false
    };
    
    setGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      deadline: "",
      category: "mind"
    });
  };
  
  const handleAddHabit = () => {
    if (!newHabit.title || !newHabit.frequency) return;
    
    const habit = {
      id: Date.now().toString(),
      title: newHabit.title,
      frequency: newHabit.frequency,
      streak: 0,
      category: newHabit.category
    };
    
    setHabits([...habits, habit]);
    setNewHabit({
      title: "",
      frequency: "",
      category: "mind"
    });
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Goals & Habits</h1>
        <p className="text-muted-foreground">
          Track your personal growth journey and build positive habits.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Progress Overview</CardTitle>
              <CardDescription>Track your accomplishments and streaks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Active Goals</h3>
                </div>
                <p className="text-3xl font-bold">{goals.filter(g => !g.completed).length}</p>
                <p className="text-sm text-muted-foreground">of {goals.length} total</p>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ListTodo className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Current Habits</h3>
                </div>
                <p className="text-3xl font-bold">{habits.length}</p>
                <p className="text-sm text-muted-foreground">habits tracked</p>
              </div>
              
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Completed</h3>
                </div>
                <p className="text-3xl font-bold">{goals.filter(g => g.completed).length}</p>
                <p className="text-sm text-muted-foreground">goals achieved</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Streaks</CardTitle>
              <CardDescription>Your longest running habits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {habits
                .sort((a, b) => b.streak - a.streak)
                .slice(0, 3)
                .map((habit, i) => (
                  <div key={habit.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{habit.title}</p>
                      <p className="text-sm text-muted-foreground">{habit.frequency}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-yellow-500" />
                      <span className="font-bold">{habit.streak}</span>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="goals">
            <Target className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="habits">
            <ListTodo className="mr-2 h-4 w-4" />
            Habits
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="goals" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Goals</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </CardTitle>
              <CardDescription>
                Track progress towards your personal targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No goals yet. Add one to get started!</p>
              ) : (
                goals.map((goal, index) => (
                  <Goal 
                    key={goal.id} 
                    goal={goal} 
                    onDelete={handleDeleteGoal}
                    index={index}
                  />
                ))
              )}
            </CardContent>
            <CardFooter className="border-t pt-6 flex-col">
              <div className="space-y-4 w-full">
                <div>
                  <h3 className="font-medium mb-2">Add New Goal</h3>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Goal title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    />
                    <Textarea 
                      placeholder="Description"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        type="date" 
                        placeholder="Deadline"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      />
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      >
                        <option value="mind">Mind</option>
                        <option value="body">Body</option>
                        <option value="soul">Soul</option>
                      </select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddGoal} disabled={!newGoal.title} className="w-full">
                  Add Goal
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="habits" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Habits</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Habit
                </Button>
              </CardTitle>
              <CardDescription>
                Build consistency with daily and weekly practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {habits.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No habits yet. Add one to get started!</p>
              ) : (
                habits.map((habit, index) => (
                  <Habit 
                    key={habit.id} 
                    habit={habit} 
                    onDelete={handleDeleteHabit}
                    index={index}
                  />
                ))
              )}
            </CardContent>
            <CardFooter className="border-t pt-6 flex-col">
              <div className="space-y-4 w-full">
                <div>
                  <h3 className="font-medium mb-2">Add New Habit</h3>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Habit title"
                      value={newHabit.title}
                      onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        placeholder="Frequency (e.g. Daily)"
                        value={newHabit.frequency}
                        onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                      />
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={newHabit.category}
                        onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                      >
                        <option value="mind">Mind</option>
                        <option value="body">Body</option>
                        <option value="soul">Soul</option>
                      </select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddHabit} disabled={!newHabit.title || !newHabit.frequency} className="w-full">
                  Add Habit
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalsPage;
