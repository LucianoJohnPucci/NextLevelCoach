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

  const generateEmailHTML = (data: ProgressReportData) => {
    const timeframeText = data.timeframeDays === 7 ? "Past Week" : "Past Month";
    
    // Calculate completion rate for goals
    const completedGoals = data.timeframeGoals.filter(g => g.completed).length;
    const totalGoals = data.timeframeGoals.length;
    const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Create sample historical data for comparison (in a real app, this would come from the database)
    const previousPeriodData = {
      meditation: Math.max(0, data.mindMetrics.meditationMinutes - Math.floor(Math.random() * 20) + 10),
      workouts: Math.max(0, data.bodyMetrics.workoutsCompleted - Math.floor(Math.random() * 2) + 1),
      reflection: Math.max(0, data.soulMetrics.reflectionMinutes - Math.floor(Math.random() * 30) + 15),
      journal: Math.max(0, data.mindMetrics.journalEntries - Math.floor(Math.random() * 2) + 1),
    };

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 16px;">
        
        <!-- Header -->
        <div style="background: #1e293b; padding: 20px 32px; text-align: center; border-radius: 12px; margin-bottom: 24px; border: 2px solid #334155;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: white;">🚀 Progress Scorecard</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; color: #94a3b8; font-weight: 500;">${timeframeText} • ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Main Dashboard Grid -->
        <div style="display: grid; grid-template-columns: 2fr 3fr; gap: 24px; margin-bottom: 24px;">
          
          <!-- Left Column: Key Metrics -->
          <div>
            <!-- Top Row Metrics -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
              <!-- Avg Mood -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; text-align: center;">
                <div style="font-size: 36px; font-weight: 800; margin-bottom: 8px; color: white;">${data.mindMetrics.averageMood}/10</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">😊 Average Mood</div>
              </div>
              <!-- Avg Energy -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; text-align: center;">
                <div style="font-size: 36px; font-weight: 800; margin-bottom: 8px; color: white;">${data.bodyMetrics.averageEnergy}/10</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">⚡ Average Energy</div>
              </div>
            </div>
            
            <!-- Bottom Row Metrics -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <!-- Tasks Done -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; text-align: center;">
                <div style="font-size: 36px; font-weight: 800; margin-bottom: 8px; color: white;">${data.taskMetrics.completionRate}%</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">✅ Tasks Completed</div>
              </div>
              <!-- Goals Hit -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px; text-align: center;">
                <div style="font-size: 36px; font-weight: 800; margin-bottom: 8px; color: white;">${goalCompletionRate}%</div>
                <div style="font-size: 14px; font-weight: 600; color: #94a3b8;">🎯 Goals Achieved</div>
              </div>
            </div>
          </div>

          <!-- Right Column: Activity Summary Table -->
          <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 24px;">
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: white; text-align: center;">📊 Activity Summary</h3>
            
            <!-- Activity Table -->
            <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
              <!-- Headers -->
              <thead>
                <tr>
                  <th style="background: #334155; color: #94a3b8; padding: 12px 16px; text-align: left; font-size: 14px; font-weight: 600; border-radius: 8px 0 0 8px; border: 1px solid #475569;">Activity</th>
                  <th style="background: #334155; color: #94a3b8; padding: 12px 16px; text-align: center; font-size: 14px; font-weight: 600; border-top: 1px solid #475569; border-bottom: 1px solid #475569;">Previous</th>
                  <th style="background: #334155; color: #94a3b8; padding: 12px 16px; text-align: center; font-size: 14px; font-weight: 600; border-radius: 0 8px 8px 0; border: 1px solid #475569;">Current</th>
                </tr>
              </thead>
              <!-- Data Rows -->
              <tbody>
                <tr>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; font-size: 15px; font-weight: 500; border-left: 1px solid #475569; border-bottom: 1px solid #475569;">🧘 Meditation (min)</td>
                  <td style="background: #0f172a; color: #94a3b8; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-bottom: 1px solid #475569;">${previousPeriodData.meditation}</td>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-right: 1px solid #475569; border-bottom: 1px solid #475569;">${data.mindMetrics.meditationMinutes}</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; font-size: 15px; font-weight: 500; border-left: 1px solid #475569; border-bottom: 1px solid #475569;">💪 Workouts</td>
                  <td style="background: #0f172a; color: #94a3b8; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-bottom: 1px solid #475569;">${previousPeriodData.workouts}</td>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-right: 1px solid #475569; border-bottom: 1px solid #475569;">${data.bodyMetrics.workoutsCompleted}</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; font-size: 15px; font-weight: 500; border-left: 1px solid #475569; border-bottom: 1px solid #475569;">🤔 Reflection (min)</td>
                  <td style="background: #0f172a; color: #94a3b8; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-bottom: 1px solid #475569;">${previousPeriodData.reflection}</td>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-right: 1px solid #475569; border-bottom: 1px solid #475569;">${data.soulMetrics.reflectionMinutes}</td>
                </tr>
                <tr>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; font-size: 15px; font-weight: 500; border-left: 1px solid #475569; border-bottom: 1px solid #475569; border-radius: 0 0 0 8px;">📝 Journal Entries</td>
                  <td style="background: #0f172a; color: #94a3b8; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-bottom: 1px solid #475569;">${previousPeriodData.journal}</td>
                  <td style="background: #0f172a; color: white; padding: 14px 16px; text-align: center; font-size: 18px; font-weight: 700; border-right: 1px solid #475569; border-bottom: 1px solid #475569; border-radius: 0 0 8px 0;">${data.mindMetrics.journalEntries}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Overall Progress Section -->
        <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 28px; text-align: center;">
          <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: white;">⭐ Overall Progress</h3>
          <div style="font-size: 52px; font-weight: 900; margin-bottom: 16px; color: white;">${data.goalsProgress.overallProgress}%</div>
          <div style="background: #334155; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 20px; max-width: 400px; margin-left: auto; margin-right: auto;">
            <div style="background: #3b82f6; height: 100%; width: ${data.goalsProgress.overallProgress}%; border-radius: 5px;"></div>
          </div>
          <p style="margin: 0; font-size: 18px; font-weight: 600; color: #94a3b8;">
            ${data.goalsProgress.overallProgress >= 70 ? 
              "Outstanding! You're crushing it! 💪" :
              data.goalsProgress.overallProgress >= 50 ?
              "Great progress! Keep it up! 🚀" :
              "Every step counts! You've got this! 💫"
            }
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px 0 12px 0;">
          <p style="margin: 0; font-size: 13px; color: #64748b;">Generated by Next Level Coach • Keep leveling up! 🚀</p>
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
