import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, Calendar, Heart, Target, TrendingUp, CheckSquare } from "lucide-react";
import { useTasks } from "@/components/tasks/useTasks";
import EmailTestDialog from "@/components/email/EmailTestDialog";
import ProgressReportDialog from "@/components/email/ProgressReportDialog";

// Sample data - In a real application, this would come from your backend
const moodData = [
  { date: "Mon", value: 7 },
  { date: "Tue", value: 8 },
  { date: "Wed", value: 6 },
  { date: "Thu", value: 9 },
  { date: "Fri", value: 7 },
  { date: "Sat", value: 8 },
  { date: "Sun", value: 9 },
];

const energyData = [
  { date: "Mon", value: 6 },
  { date: "Tue", value: 7 },
  { date: "Wed", value: 5 },
  { date: "Thu", value: 8 },
  { date: "Fri", value: 6 },
  { date: "Sat", value: 9 },
  { date: "Sun", value: 8 },
];

const emotionsData = [
  { name: "Happy", value: 35 },
  { name: "Content", value: 25 },
  { name: "Excited", value: 15 },
  { name: "Anxious", value: 10 },
  { name: "Sad", value: 5 },
  { name: "Neutral", value: 10 },
];

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#eff6ff"];

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  delay 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ElementType; 
  trend?: { value: string; direction: "up" | "down" | "neutral" }; 
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-2">{value}</div>
          <p className="text-base text-muted-foreground mb-3">{description}</p>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${
              trend.direction === "up" ? "text-green-500" : 
              trend.direction === "down" ? "text-red-500" : 
              "text-yellow-500"
            }`}>
              {trend.direction === "up" ? <TrendingUp className="mr-1 h-4 w-4" /> : 
               trend.direction === "down" ? <TrendingUp className="mr-1 h-4 w-4 rotate-180" /> : 
               <TrendingUp className="mr-1 h-4 w-4 rotate-90" />}
              {trend.value}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DashboardPage = () => {
  const { tasks } = useTasks();
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your progress and well-being insights.
            </p>
          </div>
          <div className="flex gap-2">
            <EmailTestDialog />
            <ProgressReportDialog />
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Average Mood"
          value="7.8"
          description="Over the past 7 days"
          icon={Activity}
          trend={{ value: "12% increase", direction: "up" }}
          delay={0.1}
        />
        <StatCard
          title="Average Energy"
          value="7.0"
          description="Over the past 7 days"
          icon={Heart}
          trend={{ value: "5% increase", direction: "up" }}
          delay={0.2}
        />
        <StatCard
          title="Tasks Completed"
          value={completedTasks.toString()}
          description={`Out of ${totalTasks} total tasks`}
          icon={CheckSquare}
          trend={{ value: `${completionPercentage}% completion`, direction: "neutral" }}
          delay={0.3}
        />
        <StatCard
          title="Goals Progress"
          value="68%"
          description="4 out of 6 goals on track"
          icon={Target}
          trend={{ value: "8% increase", direction: "up" }}
          delay={0.4}
        />
      </div>
      
      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mood">Mood & Energy</TabsTrigger>
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>
                  Your mood and energy levels over the past week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={moodData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Mood"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorMood)"
                      />
                      <Area
                        type="monotone"
                        data={energyData}
                        dataKey="value"
                        name="Energy"
                        stroke="#34d399"
                        fillOpacity={1}
                        fill="url(#colorEnergy)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="emotions" className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Emotion Distribution</CardTitle>
                <CardDescription>
                  Breakdown of emotions recorded in the past month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {emotionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Frequency']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>
              AI-generated insights based on your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/5 p-4">
                <h3 className="mb-2 font-medium">Mood Pattern</h3>
                <p className="text-sm text-muted-foreground">
                  Your mood tends to peak on weekends, with Sunday being your happiest day. Consider what weekend activities contribute to your wellbeing.
                </p>
              </div>
              
              <div className="rounded-lg bg-primary/5 p-4">
                <h3 className="mb-2 font-medium">Energy Fluctuation</h3>
                <p className="text-sm text-muted-foreground">
                  Your energy levels drop midweek. Consider adjusting your work schedule or incorporating energizing activities on Wednesdays.
                </p>
              </div>
              
              <div className="rounded-lg bg-primary/5 p-4">
                <h3 className="mb-2 font-medium">Emotional Wellness</h3>
                <p className="text-sm text-muted-foreground">
                  Positive emotions dominate your entries, with happiness and contentment making up 60% of your recorded feelings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
