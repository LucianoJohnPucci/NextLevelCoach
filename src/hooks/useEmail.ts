
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const useEmail = () => {
  const { toast } = useToast();

  const sendEmail = async ({ to, subject, html, from }: EmailData) => {
    try {
      console.log("Calling send-email function");
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject,
          html,
          from,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        
        // Handle specific Resend validation errors
        if (error.message && error.message.includes("You can only send testing emails")) {
          toast({
            title: "Email Restriction",
            description: "In testing mode, you can only send emails to your verified email address. Please verify a domain at resend.com/domains to send to other recipients.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to send email",
            description: error.message || "An error occurred while sending the email",
            variant: "destructive",
          });
        }
        
        throw error;
      }

      console.log("Email sent successfully:", data);
      
      toast({
        title: "Email sent successfully!",
        description: `Email sent to ${to}`,
      });

      return data;
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      // Only show toast if we haven't already shown one above
      if (!error.message || !error.message.includes("You can only send testing emails")) {
        toast({
          title: "Failed to send email",
          description: error.message || "An error occurred while sending the email",
          variant: "destructive",
        });
      }
      
      throw error;
    }
  };

  return { sendEmail };
};
