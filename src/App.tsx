
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
import DailyInputPage from "@/pages/DailyInputPage";
import DashboardPage from "@/pages/DashboardPage";
import GoalsPage from "@/pages/GoalsPage";
import WisdomPage from "@/pages/WisdomPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="mind" element={<MindPage />} />
                <Route path="body" element={<BodyPage />} />
                <Route path="soul" element={<SoulPage />} />
                <Route path="daily" element={<DailyInputPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="goals" element={<GoalsPage />} />
                <Route path="wisdom" element={<WisdomPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
