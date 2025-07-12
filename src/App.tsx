import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import MindPage from "@/pages/MindPage";
import BodyPage from "@/pages/BodyPage";
import SoulPage from "@/pages/SoulPage";
import DashboardPage from "@/pages/DashboardPage";
import GoalsPage from "@/pages/GoalsPage";
import HabitsPage from "@/pages/HabitsPage";
import WisdomPage from "@/pages/WisdomPage";
import SleepTrackerPage from "@/pages/SleepTrackerPage";
import AuthPage from "@/pages/AuthPage";
import ConfirmAccountPage from "@/pages/ConfirmAccountPage";
import SignUpPage from "@/pages/SignUp";
import OnboardingPage from "@/pages/OnboardingPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider>
            <BrowserRouter>
              <AuthProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* 
                    Auth pages - keep these routes outside the Layout to:
                    1. Handle authentication flows correctly 
                    2. Prevent authenticated users from being redirected to home before password reset
                  */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/confirm-account" element={<ConfirmAccountPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  
                  {/* Protected routes inside Layout */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="mind" element={<MindPage />} />
                    <Route path="body" element={<BodyPage />} />
                    <Route path="soul" element={<SoulPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="goals" element={<GoalsPage />} />
                    <Route path="habits" element={<HabitsPage />} />
                    <Route path="sleep" element={<SleepTrackerPage />} />
                    <Route path="wisdom" element={<WisdomPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
