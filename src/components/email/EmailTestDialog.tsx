
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, AlertCircle } from "lucide-react";
import { useEmail } from "@/hooks/useEmail";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EmailTestDialog = () => {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Test Email from Next Level Coach");
  const [message, setMessage] = useState("This is a test email from your Next Level Coach app!");
  const [loading, setLoading] = useState(false);
  
  const { sendEmail } = useEmail();

  const handleSendTest = async () => {
    if (!to.trim()) {
      return;
    }

    setLoading(true);
    
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Next Level Coach</h1>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p style="color: #666; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <footer style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">Sent from Next Level Coach</p>
          </footer>
        </div>
      `;

      await sendEmail({
        to: to.trim(),
        subject,
        html,
      });

      setOpen(false);
      setTo("");
      setMessage("This is a test email from your Next Level Coach app!");
    } catch (error) {
      console.error("Failed to send test email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" />
          Test Email Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Test Email Service</DialogTitle>
          <DialogDescription>
            Send a test email to verify your Resend integration is working correctly.
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> In testing mode, Resend only allows sending emails to your verified email address. 
            To send to other recipients, verify a domain at <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">resend.com/domains</a>.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">To Email Address</Label>
            <Input
              id="to"
              type="email"
              placeholder="test@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Your test message..."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendTest} disabled={loading || !to.trim()}>
            {loading ? "Sending..." : "Send Test Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailTestDialog;
