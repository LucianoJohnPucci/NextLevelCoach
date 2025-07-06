
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface AuthCardProps {
  onAuthSuccess: () => void;
}

const AuthCard: React.FC<AuthCardProps> = ({ onAuthSuccess }) => {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Next Level Coach</CardTitle>
        <CardDescription>
          Once the below is completed, you will be directed to a quick On-Boarding Q &amp; A for Ai to understand and tailor to your specific goals
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm onSuccess={onAuthSuccess} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthCard;
