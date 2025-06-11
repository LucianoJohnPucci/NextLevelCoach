
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "./SidebarProvider";
import { 
  Brain, 
  Home, 
  Menu, 
  X, 
  Heart, 
  Sparkles, 
  BarChart2, 
  Target, 
  MessageCircle,
  BookOpen,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DiscordCommunityDialog } from "./DiscordCommunityDialog";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, children, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-accent",
        isActive ? "bg-primary/10 text-primary" : "text-foreground"
      )}
    >
      <Icon className={cn(
        "h-5 w-5",
        isActive ? "text-primary" : "text-muted-foreground"
      )} />
      <span>{children}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="relative flex h-full flex-col overflow-y-auto border-r bg-card px-3 py-4">
      <div className="flex items-center justify-between px-2">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-medium">Next Level Coach</span>
        </Link>
        
        {/* Mobile menu button only */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle} 
          className="md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="mt-8 flex flex-col gap-1">
        <div className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground">
          Navigation
        </div>
        
        <NavItem to="/dashboard" icon={BarChart2} onClick={() => close()}>
          Dashboard
        </NavItem>
        
        <NavItem to="/notes" icon={BookOpen} onClick={() => close()}>
          Tasks & Notes
        </NavItem>
        
        <NavItem to="/goals" icon={Target} onClick={() => close()}>
          Goals & Habits
        </NavItem>
        
        <div className="mb-2 mt-6 px-4 text-xs font-semibold uppercase text-muted-foreground">
          Daily Vitals
        </div>
        
        <NavItem to="/mind" icon={Brain} onClick={() => close()}>
          Mind Vitals
        </NavItem>
        
        <NavItem to="/body" icon={Heart} onClick={() => close()}>
          Body Vitals
        </NavItem>
        
        <NavItem to="/soul" icon={Sparkles} onClick={() => close()}>
          Soul Vitals
        </NavItem>
        
        <div className="mb-2 mt-6 px-4 text-xs font-semibold uppercase text-muted-foreground">
          Tracking & Growth
        </div>
        
        <NavItem to="/wisdom" icon={MessageCircle} onClick={() => close()}>
          Wisdom
        </NavItem>
        
        <DiscordCommunityDialog>
          <button
            onClick={() => close()}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-accent text-foreground w-full text-left"
            )}
          >
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <span>Discord Community</span>
          </button>
        </DiscordCommunityDialog>
      </div>
      
      <div className="mt-auto">
        <div className="rounded-lg bg-primary/5 p-4">
          <p className="text-sm text-muted-foreground">
            "The happiness of your life depends upon the quality of your thoughts."
          </p>
          <p className="mt-1 text-right text-xs font-medium text-muted-foreground">
            - Marcus Aurelius
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
