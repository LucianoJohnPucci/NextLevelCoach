
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
      
      toast({
        title: "Failed to send email",
        description: error.message || "An error occurred while sending the email",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return { sendEmail };
};
