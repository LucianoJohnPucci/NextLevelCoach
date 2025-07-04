
import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import MindPage from "@/pages/MindPage";
import BodyPage from "@/pages/BodyPage";
import SoulPage from "@/pages/SoulPage";
import DashboardPage from "@/pages/DashboardPage";
import GoalsPage from "@/pages/GoalsPage";
import WisdomPage from "@/pages/WisdomPage";
import NotesPage from "@/pages/NotesPage";
import AuthPage from "@/pages/AuthPage";
import ConfirmAccountPage from "@/pages/ConfirmAccountPage";
import OnboardingPage from "@/pages/OnboardingPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import PasswordResetPage from "@/pages/PasswordResetPage";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Auth pages */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/reset-password" element={<PasswordResetPage />} />
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
                  <Route path="notes" element={<NotesPage />} />
                  <Route path="wisdom" element={<WisdomPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
