import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "./SidebarProvider";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Layout = () => {
  const { isOpen } = useSidebar();
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
