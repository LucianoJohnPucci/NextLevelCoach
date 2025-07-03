
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
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 30px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);">
          <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚀 Progress Scorecard</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.9); font-weight: 500;">${timeframeText} • ${new Date().toLocaleDateString()}</p>
        </div>

        <!-- Main Stats Grid -->
        <div style="padding: 30px 20px; background: white;">
          
          <!-- Key Metrics Row 1 -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 25px; gap: 15px;">
            <div style="flex: 1; text-align: center; padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; color: white;">
              <div style="font-size: 36px; font-weight: 900; margin-bottom: 5px;">${data.mindMetrics.averageMood}/10</div>
              <div style="font-size: 14px; font-weight: 600; opacity: 0.9;">Avg Mood</div>
            </div>
            <div style="flex: 1; text-align: center; padding: 20px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 12px; color: white;">
              <div style="font-size: 36px; font-weight: 900; margin-bottom: 5px;">${data.bodyMetrics.averageEnergy}/10</div>
              <div style="font-size: 14px; font-weight: 600; opacity: 0.9;">Avg Energy</div>
            </div>
          </div>

          <!-- Key Metrics Row 2 -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 25px; gap: 15px;">
            <div style="flex: 1; text-align: center; padding: 20px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 12px; color: #2d3748;">
              <div style="font-size: 36px; font-weight: 900; margin-bottom: 5px;">${data.taskMetrics.completionRate}%</div>
              <div style="font-size: 14px; font-weight: 600;">Tasks Done</div>
            </div>
            <div style="flex: 1; text-align: center; padding: 20px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); border-radius: 12px; color: #2d3748;">
              <div style="font-size: 36px; font-weight: 900; margin-bottom: 5px;">${goalCompletionRate}%</div>
              <div style="font-size: 14px; font-weight: 600;">Goals Hit</div>
            </div>
          </div>

          <!-- Activity Stats -->
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; color: #2d3748; text-align: center;">🎯 Activity Highlights</h3>
            <div style="display: flex; justify-content: space-around; text-align: center;">
              <div>
                <div style="font-size: 24px; font-weight: 800; color: #5a67d8; margin-bottom: 3px;">${data.mindMetrics.meditationMinutes}</div>
                <div style="font-size: 12px; color: #718096;">Meditation Min</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: 800; color: #ed8936; margin-bottom: 3px;">${data.bodyMetrics.workoutsCompleted}</div>
                <div style="font-size: 12px; color: #718096;">Workouts</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: 800; color: #38b2ac; margin-bottom: 3px;">${data.soulMetrics.reflectionMinutes}</div>
                <div style="font-size: 12px; color: #718096;">Reflection Min</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: 800; color: #d69e2e; margin-bottom: 3px;">${data.mindMetrics.journalEntries}</div>
                <div style="font-size: 12px; color: #718096;">Journal Entries</div>
              </div>
            </div>
          </div>

          <!-- Overall Progress -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; text-align: center; color: white; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">🌟 Overall Progress</h3>
            <div style="font-size: 48px; font-weight: 900; margin-bottom: 10px;">${data.goalsProgress.overallProgress}%</div>
            <div style="background: rgba(255,255,255,0.2); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 15px;">
              <div style="background: white; height: 100%; width: ${data.goalsProgress.overallProgress}%; border-radius: 4px;"></div>
            </div>
            <p style="margin: 0; font-size: 16px; font-weight: 600; opacity: 0.95;">You're crushing it! Keep going! 💪</p>
          </div>

          <!-- Encouragement Section -->
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); border-radius: 12px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #2d3748;">🎉 You're Doing Amazing!</h3>
            <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.4;">
              ${data.goalsProgress.overallProgress >= 70 ? 
                "Outstanding performance! You're in the top tier of achievers. Keep this momentum going!" :
                data.goalsProgress.overallProgress >= 50 ?
                "Great work! You're making solid progress. A few more consistent days and you'll be unstoppable!" :
                "Every step counts! You're building great habits. Tomorrow is a new opportunity to shine!"
              }
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background: #2d3748; color: white; text-align: center; padding: 20px;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">Generated by Next Level Coach • Keep leveling up! 🚀</p>
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
