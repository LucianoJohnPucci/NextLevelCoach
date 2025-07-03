
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
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: white;">🚀 Progress Scorecard</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 500;">${timeframeText} • ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 24px;">
          
          <!-- Key Metrics Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <!-- Avg Mood -->
            <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); border-radius: 10px; color: white;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 4px;">${data.mindMetrics.averageMood}/10</div>
              <div style="font-size: 12px; font-weight: 600; opacity: 0.9;">Avg Mood</div>
            </div>
            <!-- Avg Energy -->
            <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 10px; color: white;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 4px;">${data.bodyMetrics.averageEnergy}/10</div>
              <div style="font-size: 12px; font-weight: 600; opacity: 0.9;">Avg Energy</div>
            </div>
            <!-- Tasks Done -->
            <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 10px; color: white;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 4px;">${data.taskMetrics.completionRate}%</div>
              <div style="font-size: 12px; font-weight: 600; opacity: 0.9;">Tasks Done</div>
            </div>
            <!-- Goals Hit -->
            <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 10px; color: white;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 4px;">${goalCompletionRate}%</div>
              <div style="font-size: 12px; font-weight: 600; opacity: 0.9;">Goals Hit</div>
            </div>
          </div>

          <!-- Activity Highlights -->
          <div style="background: #f8fafc; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #374151; text-align: center;">🎯 Activity Highlights</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center;">
              <div>
                <div style="font-size: 20px; font-weight: 800; color: #3b82f6; margin-bottom: 2px;">${data.mindMetrics.meditationMinutes}</div>
                <div style="font-size: 10px; color: #6b7280; line-height: 1.2;">Meditation<br>Minutes</div>
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 800; color: #f59e0b; margin-bottom: 2px;">${data.bodyMetrics.workoutsCompleted}</div>
                <div style="font-size: 10px; color: #6b7280; line-height: 1.2;">Workouts<br>Done</div>
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-bottom: 2px;">${data.soulMetrics.reflectionMinutes}</div>
                <div style="font-size: 10px; color: #6b7280; line-height: 1.2;">Reflection<br>Minutes</div>
              </div>
              <div>
                <div style="font-size: 20px; font-weight: 800; color: #8b5cf6; margin-bottom: 2px;">${data.mindMetrics.journalEntries}</div>
                <div style="font-size: 10px; color: #6b7280; line-height: 1.2;">Journal<br>Entries</div>
              </div>
            </div>
          </div>

          <!-- Overall Progress -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 10px; padding: 20px; text-align: center; color: white;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700;">🌟 Overall Progress</h3>
            <div style="font-size: 36px; font-weight: 900; margin-bottom: 8px;">${data.goalsProgress.overallProgress}%</div>
            <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 12px;">
              <div style="background: white; height: 100%; width: ${data.goalsProgress.overallProgress}%; border-radius: 3px;"></div>
            </div>
            <p style="margin: 0; font-size: 14px; font-weight: 600; opacity: 0.95;">
              ${data.goalsProgress.overallProgress >= 70 ? 
                "Outstanding! You're crushing it! 💪" :
                data.goalsProgress.overallProgress >= 50 ?
                "Great progress! Keep it up! 🚀" :
                "Every step counts! You've got this! 💫"
              }
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; text-align: center; padding: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">Generated by Next Level Coach • Keep leveling up! 🚀</p>
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
