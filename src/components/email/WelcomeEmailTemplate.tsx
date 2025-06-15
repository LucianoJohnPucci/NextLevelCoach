
interface WelcomeEmailProps {
  firstName: string;
  userEmail: string;
}

export const createWelcomeEmailHTML = ({ firstName, userEmail }: WelcomeEmailProps): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Next Level Coach</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                    Welcome to Next Level Coach! 🎉
                </h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">
                    Hello ${firstName}! 👋
                </h2>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                    We're thrilled to have you join our community of individuals committed to leveling up their Mind, Body, and Soul.
                </p>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                    Your wellness journey starts now! Here's what you can expect:
                </p>
                
                <!-- Features -->
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h3 style="color: #333; margin-top: 0;">🧠 Mind</h3>
                    <p style="color: #666; margin-bottom: 15px;">Daily meditation, focus tracking, and mindfulness practices</p>
                    
                    <h3 style="color: #333;">💪 Body</h3>
                    <p style="color: #666; margin-bottom: 15px;">Workout tracking, nutrition guidance, and physical wellness metrics</p>
                    
                    <h3 style="color: #333;">✨ Soul</h3>
                    <p style="color: #666; margin-bottom: 0;">Reflection practices, gratitude journaling, and spiritual growth</p>
                </div>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                    Remember: <strong>Daily check-ins with modifications allow new habits to be BORN! 🌱</strong>
                </p>
                
                <div style="text-align: center;">
                    <p style="color: #666; margin-bottom: 10px;">Ready to begin your transformation?</p>
                    <p style="color: #999; font-size: 14px;">Start by completing your daily checklist and setting your first goals.</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    This email was sent to ${userEmail}<br>
                    Next Level Coach - Your Personal Wellness Journey
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};
