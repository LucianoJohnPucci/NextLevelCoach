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

    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 700px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 16px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 16px 24px; text-align: center; border-radius: 12px; margin-bottom: 20px; border: 2px solid #334155;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: white;">🚀 Progress Scorecard</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #94a3b8; font-weight: 500;">${timeframeText} • ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Main Dashboard Grid -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px;">
          
          <!-- Left Column: Key Metrics -->
          <div>
            <!-- Top Row Metrics -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <!-- Avg Mood -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 6px; color: white;">${data.mindMetrics.averageMood}/10</div>
                <div style="font-size: 13px; font-weight: 600; color: #94a3b8;">Average Mood</div>
              </div>
              <!-- Avg Energy -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 6px; color: white;">${data.bodyMetrics.averageEnergy}/10</div>
                <div style="font-size: 13px; font-weight: 600; color: #94a3b8;">Average Energy</div>
              </div>
            </div>
            
            <!-- Bottom Row Metrics -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <!-- Tasks Done -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 6px; color: white;">${data.taskMetrics.completionRate}%</div>
                <div style="font-size: 13px; font-weight: 600; color: #94a3b8;">Tasks Completed</div>
              </div>
              <!-- Goals Hit -->
              <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 32px; font-weight: 800; margin-bottom: 6px; color: white;">${goalCompletionRate}%</div>
                <div style="font-size: 13px; font-weight: 600; color: #94a3b8;">Goals Achieved</div>
              </div>
            </div>
          </div>

          <!-- Right Column: Activity Summary -->
          <div style="background: #1e293b; border: 2px solid #334155; border-radius: 12px; padding: 20px;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: white; text-align: center;">🎯 Activity Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; text-align: center;">
              <div>
                <div style="font-size: 24px; font-weight: 800; color: white; margin-bottom: 4px;">${data.mindMetrics.meditationMinutes}</div>
                <div style="font-size: 11px; color: #94a3b8; line-height: 1.3;">Meditation<br>Minutes</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: 800; color: white; margin-bottom: 4px;">${data.bodyMetrics.workoutsCompleted}</div>
                <div style="font-size: 11px; color: #94a3b8; line-height: 1.3;">Workouts<br>Completed</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: 800; color: white; margin-bottom: 4px;">${data.soulMetrics.reflectionMinutes}</div>
                <div style="font-size: 11px; color: #94a3b8; line-height: 1.3;">Reflection<br>Minutes</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: 800; color: white; margin-bottom: 4px;">${data.mindMetrics.journalEntries}</div>
                <div style="font-size: 11px; color: #94a3b8; line-height: 1.3;">Journal<br>Entries</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overall Progress Section -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border: 2px solid #334155; border-radius: 12px; padding: 24px; text-align: center;">
          <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 700; color: white;">⭐ Overall Progress</h3>
          <div style="font-size: 48px; font-weight: 900; margin-bottom: 12px; color: white;">${data.goalsProgress.overallProgress}%</div>
          <div style="background: #334155; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 16px; max-width: 300px; margin-left: auto; margin-right: auto;">
            <div style="background: #3b82f6; height: 100%; width: ${data.goalsProgress.overallProgress}%; border-radius: 4px;"></div>
          </div>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: #94a3b8;">
            ${data.goalsProgress.overallProgress >= 70 ? 
              "Outstanding! You're crushing it! 💪" :
              data.goalsProgress.overallProgress >= 50 ?
              "Great progress! Keep it up! 🚀" :
              "Every step counts! You've got this! 💫"
            }
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 16px 0 8px 0;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">Generated by Next Level Coach • Keep leveling up! 🚀</p>
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
