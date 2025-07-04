import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart2, Clock, Loader2 } from "lucide-react";
import { useEmail } from "@/hooks/useEmail";
import { useProgressReport, ProgressReportData } from "@/hooks/useProgressReport";
import { useAuth } from "@/components/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProgressReportDialog = () => {
  const [open, setOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("7");
  const [loading, setLoading] = useState(false);
  
  const { sendEmail } = useEmail();
  const { generateReportData } = useProgressReport();
  const { user } = useAuth();

  const generateWeeklyColumns = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => `<th style="background: #1e293b; color: #94a3b8; padding: 16px 12px; text-align: center; font-size: 16px; font-weight: 600; border: 1px solid #334155; border-radius: 8px; margin: 2px;">${day}</th>`).join('');
  };

  const generateMonthlyColumns = () => {
    const now = new Date();
    const weeks = [];
    
    // Generate 4 weeks of date ranges
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7) - 6);
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (i * 7));
      
      const startStr = `${String(weekStart.getMonth() + 1).padStart(2, '0')}/${String(weekStart.getDate()).padStart(2, '0')}/${weekStart.getFullYear()}`;
      const endStr = `${String(weekEnd.getMonth() + 1).padStart(2, '0')}/${String(weekEnd.getDate()).padStart(2, '0')}/${weekEnd.getFullYear()}`;
      
      weeks.push(`<th style="background: #1e293b; color: #94a3b8; padding: 16px 12px; text-align: center; font-size: 14px; font-weight: 600; border: 1px solid #334155; border-radius: 8px; margin: 2px;">${startStr}-${endStr}</th>`);
    }
    
    return weeks.join('');
  };

  const generateWeeklyData = (activity: string, currentValue: number) => {
    // Generate sample data for 7 days
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const value = Math.max(0, currentValue + Math.floor(Math.random() * 6) - 3);
      dailyData.push(`<td style="background: #0f172a; color: white; padding: 18px 12px; text-align: center; font-size: 18px; font-weight: 700; border: 1px solid #334155; border-radius: 6px; margin: 2px;">${value}</td>`);
    }
    return dailyData.join('');
  };

  const generateMonthlyData = (activity: string, currentValue: number) => {
    // Generate sample data for 4 weeks
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
      const value = Math.max(0, Math.floor(currentValue * (0.7 + Math.random() * 0.6)));
      weeklyData.push(`<td style="background: #0f172a; color: white; padding: 18px 12px; text-align: center; font-size: 18px; font-weight: 700; border: 1px solid #334155; border-radius: 6px; margin: 2px;">${value}</td>`);
    }
    return weeklyData.join('');
  };

  const generateEmailHTML = (data: ProgressReportData) => {
    const timeframeText = data.timeframeDays === 7 ? "Past Week" : "Past Month";
    const isWeekly = data.timeframeDays === 7;
    
    // Calculate completion rate for goals
    const completedGoals = data.timeframeGoals.filter(g => g.completed).length;
    const totalGoals = data.timeframeGoals.length;
    const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Calculate additional metrics
    const averageSleep = 7.5; // Mock data - should come from sleep tracking
    const highestEmotion = Object.keys(data.emotionDistribution).length > 0 
      ? Math.max(...Object.values(data.emotionDistribution)) 
      : 0;
    const newHabits = data.timeframeHabits.length; // Number of habits being tracked
    const nutritionEntries = Math.floor(Math.random() * 20) + 5; // Mock data

    const activityData = [
      { name: '🧘 Meditation (min)', value: data.mindMetrics.meditationMinutes },
      { name: '💪 Workouts', value: data.bodyMetrics.workoutsCompleted },
      { name: '🤔 Reflection (min)', value: data.soulMetrics.reflectionMinutes },
      { name: '📝 Journal Entries', value: data.mindMetrics.journalEntries }
    ];

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; background: #0f172a; padding: 32px; border-radius: 16px;">
        
        <!-- Header -->
        <div style="background: #1e293b; padding: 24px 40px; text-align: center; border-radius: 12px; margin-bottom: 32px; border: 2px solid #334155;">
          <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: white;">🚀 Progress Scorecard</h1>
          <p style="margin: 12px 0 0 0; font-size: 18px; color: #94a3b8; font-weight: 500;">${timeframeText} • ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Main Dashboard Grid -->
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px; margin-bottom: 32px;">
          
          <!-- Left Column: 8 Key Metrics in 2x4 Grid -->
          <div>
            <!-- Metrics Grid (2 columns, 4 rows) -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
              <!-- Row 1 -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${data.mindMetrics.averageMood}/10</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">😊 Average Mood</div>
              </div>
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${data.bodyMetrics.averageEnergy}/10</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">⚡ Average Energy</div>
              </div>
              
              <!-- Row 2 -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${data.taskMetrics.completionRate}%</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">✅ Tasks Completed</div>
              </div>
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${goalCompletionRate}%</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">🎯 Goals Achieved</div>
              </div>
              
              <!-- Row 3 -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${averageSleep}h</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">😴 Average Sleep</div>
              </div>
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${highestEmotion}%</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">🧠 Highest Emotion</div>
              </div>
              
              <!-- Row 4 -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${newHabits}</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">🔄 New Habits</div>
              </div>
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white;">${nutritionEntries}</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">🍎 Nutrition Entries</div>
              </div>
            </div>
          </div>

          <!-- Right Column: Activity Summary Table -->
          <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 28px;">
            <h3 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 700; color: white; text-align: center;">📊 Activity Summary</h3>
            
            <!-- Activity Table -->
            <table style="width: 100%; border-collapse: separate; border-spacing: 4px;">
              <!-- Headers -->
              <thead>
                <tr>
                  <th style="background: #334155; color: #94a3b8; padding: 16px 20px; text-align: left; font-size: 16px; font-weight: 600; border-radius: 8px; border: 1px solid #475569;">Activity</th>
                  ${isWeekly ? generateWeeklyColumns() : generateMonthlyColumns()}
                </tr>
              </thead>
              <!-- Data Rows -->
              <tbody>
                ${activityData.map(activity => `
                  <tr>
                    <td style="background: #0f172a; color: white; padding: 18px 20px; font-size: 16px; font-weight: 500; border: 1px solid #334155; border-radius: 8px;">${activity.name}</td>
                    ${isWeekly ? generateWeeklyData(activity.name, activity.value) : generateMonthlyData(activity.name, activity.value)}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Overall Progress Section -->
        <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 32px; text-align: center;">
          <h3 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700; color: white;">⭐ Overall Progress</h3>
          <div style="font-size: 56px; font-weight: 900; margin-bottom: 20px; color: white;">${data.goalsProgress.overallProgress}%</div>
          <div style="background: #334155; height: 12px; border-radius: 6px; overflow: hidden; margin-bottom: 24px; max-width: 500px; margin-left: auto; margin-right: auto;">
            <div style="background: #3b82f6; height: 100%; width: ${data.goalsProgress.overallProgress}%; border-radius: 6px;"></div>
          </div>
          <p style="margin: 0; font-size: 20px; font-weight: 600; color: #94a3b8;">
            ${data.goalsProgress.overallProgress >= 70 ? 
              "Outstanding! You're crushing it! 💪" :
              data.goalsProgress.overallProgress >= 50 ?
              "Great progress! Keep it up! 🚀" :
              "Every step counts! You've got this! 💫"
            }
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0 16px 0;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">Generated by Next Level Coach • Keep leveling up! 🚀</p>
        </div>

      </div>
    `;
  };

  const handleSendReport = async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      const timeframeDays = parseInt(timeframe);
      const reportData = await generateReportData(timeframeDays);
      const html = generateEmailHTML(reportData);
      const timeframeText = timeframeDays === 7 ? "Weekly" : "Monthly";

      await sendEmail({
        to: user.email!,
        subject: `🚀 Your ${timeframeText} Progress Scorecard - You're Crushing It!`,
        html,
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to send progress report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart2 className="h-4 w-4" />
          Email Progress Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Progress Scorecard</DialogTitle>
          <DialogDescription>
            Send yourself a quick, visual scorecard with your key metrics and achievements.
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your scorecard will show mood, energy, task completion, goals hit, and key activity highlights in a quick-read format.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timeframe">Report Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Past Week</SelectItem>
                <SelectItem value="30">Past Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSendReport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Scorecard"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressReportDialog;
