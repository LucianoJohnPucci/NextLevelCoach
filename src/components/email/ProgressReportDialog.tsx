
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
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Next Level Coach</h1>
          <h2 style="margin: 20px 0 0 0; font-size: 24px; font-weight: normal;">Progress Report - ${timeframeText}</h2>
        </div>
        
        <div style="padding: 40px 20px;">
          <!-- Overall Progress -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">🎯 Overall Progress</h3>
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="flex: 1;">
                <div style="background: #e5e7eb; height: 12px; border-radius: 6px; overflow: hidden;">
                  <div style="background: linear-gradient(90deg, #3b82f6, #10b981); height: 100%; width: ${data.goalsProgress.overallProgress}%;"></div>
                </div>
              </div>
              <span style="font-size: 24px; font-weight: bold; color: #1f2937;">${data.goalsProgress.overallProgress}%</span>
            </div>
          </div>

          <!-- Mind Section -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 20px;">🧠 Mind Vitals</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.mindMetrics.averageMood}/10</div>
                <div style="color: #6b7280; margin-top: 8px;">Average Mood</div>
                <div style="color: #10b981; font-size: 12px; margin-top: 4px;">↗ ${data.mindMetrics.moodTrend}</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.mindMetrics.meditationMinutes}</div>
                <div style="color: #6b7280; margin-top: 8px;">Meditation Minutes</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.mindMetrics.journalEntries}</div>
                <div style="color: #6b7280; margin-top: 8px;">Journal Entries</div>
              </div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <div style="background: #3b82f6; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block;">
                Mind Progress: ${data.goalsProgress.mindProgress}%
              </div>
            </div>
          </div>

          <!-- Body Section -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #ef4444; margin: 0 0 20px 0; font-size: 20px;">💪 Body Vitals</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.bodyMetrics.averageEnergy}/10</div>
                <div style="color: #6b7280; margin-top: 8px;">Average Energy</div>
                <div style="color: #10b981; font-size: 12px; margin-top: 4px;">↗ ${data.bodyMetrics.energyTrend}</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.bodyMetrics.workoutsCompleted}</div>
                <div style="color: #6b7280; margin-top: 8px;">Workouts Completed</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.bodyMetrics.waterIntake}L</div>
                <div style="color: #6b7280; margin-top: 8px;">Water Intake</div>
              </div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <div style="background: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block;">
                Body Progress: ${data.goalsProgress.bodyProgress}%
              </div>
            </div>
          </div>

          <!-- Soul Section -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #8b5cf6; margin: 0 0 20px 0; font-size: 20px;">✨ Soul Vitals</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.soulMetrics.reflectionMinutes}</div>
                <div style="color: #6b7280; margin-top: 8px;">Reflection Minutes</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.soulMetrics.connectionsAttended}</div>
                <div style="color: #6b7280; margin-top: 8px;">Connections Attended</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937;">${data.soulMetrics.gratitudeStreak}</div>
                <div style="color: #6b7280; margin-top: 8px;">Gratitude Streak</div>
              </div>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <div style="background: #8b5cf6; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block;">
                Soul Progress: ${data.goalsProgress.soulProgress}%
              </div>
            </div>
          </div>

          <!-- Tasks Section -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #059669; margin: 0 0 20px 0; font-size: 20px;">✅ Task Completion</h3>
            <div style="text-align: center;">
              <div style="font-size: 48px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">${data.taskMetrics.completionRate}%</div>
              <div style="color: #6b7280; margin-bottom: 20px;">
                ${data.taskMetrics.completedTasks} out of ${data.taskMetrics.totalTasks} tasks completed
              </div>
              <div style="background: #e5e7eb; height: 12px; border-radius: 6px; overflow: hidden; max-width: 300px; margin: 0 auto;">
                <div style="background: #059669; height: 100%; width: ${data.taskMetrics.completionRate}%;"></div>
              </div>
            </div>
          </div>

          <!-- Insights -->
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">💡 Key Insights</h3>
            <div style="space-y: 16px;">
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <strong>🎯 Progress Highlight:</strong> Your overall progress is at ${data.goalsProgress.overallProgress}%, showing consistent growth across all areas.
              </div>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <strong>📈 Trend Analysis:</strong> Your mood has improved by ${data.mindMetrics.moodTrend} and energy levels are up by ${data.bodyMetrics.energyTrend}.
              </div>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px;">
                <strong>🌟 Next Steps:</strong> Continue building on your ${data.taskMetrics.completionRate}% task completion rate to maintain momentum.
              </div>
            </div>
          </div>
        </div>
        
        <footer style="background: #1f2937; color: white; text-align: center; padding: 30px 20px;">
          <p style="margin: 0 0 10px 0; font-size: 18px;">Keep up the great work! 🚀</p>
          <p style="margin: 0; color: #9ca3af; font-size: 14px;">Generated by Next Level Coach on ${new Date().toLocaleDateString()}</p>
        </footer>
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
        subject: `Your ${timeframeText} Progress Report - Next Level Coach`,
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
          <DialogTitle>Email Progress Report</DialogTitle>
          <DialogDescription>
            Send yourself a comprehensive progress report with your latest metrics and insights.
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your report will include data from Mind, Body, and Soul vitals, task completion rates, and personalized insights.
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
              "Send Report"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressReportDialog;
