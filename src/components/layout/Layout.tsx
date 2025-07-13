
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "./SidebarProvider";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const Layout = () => {
  const { isOpen, toggle } = useSidebar();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  // Prevent animation on initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show the standard app layout for non-authenticated users on the home page
  const isHomePage = location.pathname === "/";
  if (isHomePage && !user) {
    return <Outlet />;
  }

  const buttonLeft = isOpen ? 304 : 24; // sidebar 280px + 16 margin when open

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 h-full transform bg-card shadow-lg transition-all duration-300 ease-in-out md:relative ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${mounted ? "" : "!transition-none"}`}
        style={{ width: isOpen ? "280px" : "0", minWidth: isOpen ? "280px" : "0" }}
      >
        <Sidebar />
      </div>

      {/* Floating toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggle}
        className="fixed z-30 top-4 h-3 w-3 p-0 flex items-center justify-center border-2 rounded-md"
        style={{ borderColor: '#3b82f6', backgroundColor: '#3b82f622', color: '#3b82f6', left: buttonLeft }}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? <PanelLeftClose className="h-3 w-3" /> : <PanelLeftOpen className="h-3 w-3" />}
      </Button>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto px-4 py-8 md:px-6 lg:px-8">
          <div 
            className={`mx-auto max-w-screen-xl animate-fade-in transition-all duration-300 ${
              isOpen ? "md:ml-0" : "md:ml-0"
            }`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
