
import { useSidebar } from "./SidebarProvider";
import { useAuth } from "@/components/AuthProvider";
import { UserProfileButton } from "@/components/UserProfileButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const { isOpen, toggle } = useSidebar();

  // Don't show header for non-authenticated users
  if (!user) {
    return null;
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 lg:px-6">
      <div className="flex items-center gap-2">
        {/* Sidebar toggle button - always visible */}
        <Button
          variant="outline"
          size="icon"
          style={{ borderColor: '#c084fc', backgroundColor: '#c084fc22', color: '#c084fc' }}
          onClick={toggle}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserProfileButton />
      </div>
    </header>
  );
};

export default Header;
