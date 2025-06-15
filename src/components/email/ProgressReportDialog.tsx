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
    const sortedDatesSet = new Set([...data.timeframeGoals.map(g => g.date)]);
    data.timeframeHabits.forEach(h =>
      Object.keys(h.statusByDate).forEach(date => sortedDatesSet.add(date))
    );
    const sortedDates = Array.from(sortedDatesSet).sort();

    // Table rows for goals
    const goalsRows = sortedDates.map(date => {
      const dateGoals = data.timeframeGoals.filter(g => g.date === date);
      if (!dateGoals.length) return "";
      return `
        <tr>
          <td style="padding:8px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">${date}</td>
          <td style="padding:8px;font-size:14px;border-bottom:1px solid #e2e8f0;">
            ${dateGoals.map(goal => `
              <div style="margin-bottom:8px;padding:8px;background:#f8fafc;border-radius:6px;">
                <span style="color:${goal.completed ? '#10b981' : '#ef4444'};font-weight:600;margin-right:8px;">
                  ${goal.completed ? "✓" : "✗"}
                </span> 
                <strong>${goal.title}</strong> 
                <span style="color:#94a3b8;margin-left:8px;">(${goal.category})</span>
              </div>
            `).join("")}
          </td>
        </tr>
      `;
    }).filter(Boolean).join("");

    // Table rows for habits
    const habitsRows = data.timeframeHabits.map(habit => {
      return `
        <tr>
          <td style="padding:8px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;vertical-align:top;">
            <strong>${habit.title}</strong><br>
            <span style="color:#94a3b8;font-size:12px;">(${habit.frequency})</span>
          </td>
          <td style="padding:8px;font-size:14px;border-bottom:1px solid #e2e8f0;">
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${sortedDates.map(date => `
                <div style="display:flex;flex-direction:column;align-items:center;padding:4px;background:#f8fafc;border-radius:4px;min-width:60px;">
                  <span style="color:${habit.statusByDate[date] ? '#10b981' : '#d1d5db'};font-size:20px;line-height:1;">
                    ${habit.statusByDate[date] ? "●" : "○"}
                  </span>
                  <span style="font-size:10px;color:#64748b;margin-top:2px;">${date.slice(-2)}</span>
                </div>
              `).join("")}
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Generate emotion distribution chart data
    const emotionEntries = Object.entries(data.emotionDistribution);
    const hasEmotionData = emotionEntries.length > 0 && emotionEntries.some(([_, value]) => value > 0);
    
    // Define colors for emotions
    const emotionColors: { [key: string]: string } = {
      'Happy': '#3b82f6',
      'Content': '#60a5fa', 
      'Neutral': '#e5e7eb',
      'Sad': '#f87171',
      'Anxious': '#fbbf24',
      'Excited': '#10b981',
      'Angry': '#ef4444',
      'Peaceful': '#8b5cf6',
      'Frustrated': '#f59e0b',
      'Grateful': '#06d6a0'
    };

    // Create SVG pie chart
    let pieChartSVG = '';
    if (hasEmotionData) {
      const radius = 80;
      const centerX = 100;
      const centerY = 100;
      let currentAngle = 0;
      
      const sortedEmotions = emotionEntries
        .filter(([_, value]) => value > 0)
        .sort(([_, a], [__, b]) => b - a);

      const paths = sortedEmotions.map(([emotion, percentage]) => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + (percentage / 100) * 2 * Math.PI;
        currentAngle = endAngle;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
        const color = emotionColors[emotion] || '#6b7280';

        return `<path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z" fill="${color}" stroke="#fff" stroke-width="2"/>`;
      }).join('');

      // Create legend
      const legend = sortedEmotions.map(([emotion, percentage], index) => {
        const color = emotionColors[emotion] || '#6b7280';
        const y = 20 + index * 25;
        return `
          <rect x="220" y="${y}" width="12" height="12" fill="${color}"/>
          <text x="240" y="${y + 9}" font-family="Arial, sans-serif" font-size="12" fill="#374151">${emotion} ${percentage}%</text>
        `;
      }).join('');

      pieChartSVG = `
        <svg width="400" height="200" viewBox="0 0 400 200" style="margin: 20px auto; display: block;">
          ${paths}
          ${legend}
        </svg>
      `;
    }

    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background-color: #f8fafc;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Next Level Coach</h1>
          <h2 style="margin: 20px 0 0 0; font-size: 24px; font-weight: normal;">Progress Report - ${data.timeframeDays === 7 ? "Past Week" : "Past Month"}</h2>
        </div>
        
        <div style="padding: 40px 20px;">
          <!-- Key Insights -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">💡 Key Insights</h3>
            <div style="display: block;">
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

          <!-- Emotion Distribution Chart -->
          ${hasEmotionData ? `
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #8b5cf6; margin: 0 0 20px 0; font-size: 20px;">😊 Emotion Distribution</h3>
            <p style="color: #6b7280; margin: 0 0 20px 0;">Breakdown of emotions recorded in the ${timeframeText.toLowerCase()}.</p>
            ${pieChartSVG}
          </div>
          ` : ''}

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

          <!-- GOALS & HABITS SECTION -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #0ea5e9; margin: 0 0 20px 0; font-size: 20px;">🏆 Goals & Habits</h3>
            
            <div style="margin-bottom: 30px;">
              <h4 style="color:#6366f1; font-size:18px; margin:0 0 15px 0;">Daily Goals</h4>
              <table style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="text-align:left;padding:12px;font-size:14px;font-weight:600;color:#374151;border-bottom:2px solid #e2e8f0;">Date</th>
                    <th style="text-align:left;padding:12px;font-size:14px;font-weight:600;color:#374151;border-bottom:2px solid #e2e8f0;">Goals</th>
                  </tr>
                </thead>
                <tbody>
                  ${goalsRows || `<tr><td colspan="2" style="color:#94a3b8;font-size:14px;padding:20px;text-align:center;border-bottom:1px solid #e2e8f0;">No goals set for this period.</td></tr>`}
                </tbody>
              </table>
            </div>
            
            <div>
              <h4 style="color:#22c55e; font-size:18px; margin:0 0 15px 0;">Habits Completion</h4>
              <table style="border-collapse:collapse;width:100%;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="text-align:left;padding:12px;font-size:14px;font-weight:600;color:#374151;border-bottom:2px solid #e2e8f0;">Habit</th>
                    <th style="text-align:left;padding:12px;font-size:14px;font-weight:600;color:#374151;border-bottom:2px solid #e2e8f0;">Daily Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${habitsRows || `<tr><td colspan="2" style="color:#94a3b8;font-size:14px;padding:20px;text-align:center;border-bottom:1px solid #e2e8f0;">No habits found for this period.</td></tr>`}
                </tbody>
              </table>
              <p style="color:#64748b;font-size:12px;margin-top:12px;font-style:italic;">● = completed, ○ = missed. Numbers show day of month.</p>
            </div>
          </div>

          <!-- Mind Section with Horizontal Metrics -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #3b82f6; margin: 0 0 20px 0; font-size: 20px;">🧠 Mind Vitals</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.mindMetrics.averageMood}/10</div>
                <div style="color: #6b7280; font-size: 14px;">Avg Mood</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.mindMetrics.meditationMinutes}</div>
                <div style="color: #6b7280; font-size: 14px;">Meditation Min</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.mindMetrics.journalEntries}</div>
                <div style="color: #6b7280; font-size: 14px;">Journal Entries</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.mindMetrics.readingSessions}</div>
                <div style="color: #6b7280; font-size: 14px;">Reading Sessions</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.mindMetrics.learningSessions}</div>
                <div style="color: #6b7280; font-size: 14px;">Learning Sessions</div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 25px; display: inline-block; font-size: 16px; font-weight: 600;">
                Mind Progress: ${data.goalsProgress.mindProgress}%
              </div>
            </div>
          </div>

          <!-- Body Section with Horizontal Metrics -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #ef4444; margin: 0 0 20px 0; font-size: 20px;">💪 Body Vitals</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.bodyMetrics.averageEnergy}/10</div>
                <div style="color: #6b7280; font-size: 14px;">Avg Energy</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.bodyMetrics.workoutsCompleted}</div>
                <div style="color: #6b7280; font-size: 14px;">Workouts</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.bodyMetrics.yogaSessions}</div>
                <div style="color: #6b7280; font-size: 14px;">Yoga Sessions</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.bodyMetrics.cardioSessions}</div>
                <div style="color: #6b7280; font-size: 14px;">Cardio Sessions</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.bodyMetrics.strengthSessions}</div>
                <div style="color: #6b7280; font-size: 14px;">Strength</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.bodyMetrics.stretchSessions}</div>
                <div style="color: #6b7280; font-size: 14px;">Stretch</div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="background: #ef4444; color: white; padding: 12px 24px; border-radius: 25px; display: inline-block; font-size: 16px; font-weight: 600;">
                Body Progress: ${data.goalsProgress.bodyProgress}%
              </div>
            </div>
          </div>

          <!-- Soul Section with Horizontal Metrics -->
          <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #8b5cf6; margin: 0 0 20px 0; font-size: 20px;">✨ Soul Vitals</h3>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.soulMetrics.reflectionMinutes}</div>
                <div style="color: #6b7280; font-size: 14px;">Reflection</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.soulMetrics.meditationSessions}</div>
                <div style="color: #6b7280; font-size: 14px;">Meditation</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.soulMetrics.gratitudeMoments}</div>
                <div style="color: #6b7280; font-size: 14px;">Gratitude</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.soulMetrics.helpedSomeone}</div>
                <div style="color: #6b7280; font-size: 14px;">Helped</div>
              </div>
              <div style="text-align: center; min-width: 100px;">
                <div style="font-size: 36px; font-weight: bold; color: #1f2937; margin-bottom: 8px;">${data.soulMetrics.gratitudeStreak}</div>
                <div style="color: #6b7280; font-size: 14px;">Gratitude Streak</div>
              </div>
            </div>
            <div style="text-align: center;">
              <div style="background: #8b5cf6; color: white; padding: 12px 24px; border-radius: 25px; display: inline-block; font-size: 16px; font-weight: 600;">
                Soul Progress: ${data.goalsProgress.soulProgress}%
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
