
import { useSidebar } from "./SidebarProvider";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/":
      return "Home";
    case "/mind":
      return "Mind";
    case "/body":
      return "Body";
    case "/soul":
      return "Soul";
    case "/daily":
      return "Daily Input";
    case "/dashboard":
      return "Dashboard";
    case "/goals":
      return "Goals & Habits";
    case "/wisdom":
      return "Wisdom";
    default:
      return "Mindful";
  }
};

const Header = () => {
  const { isOpen, toggle } = useSidebar();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="border-b bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggle} 
            className="text-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <h1 className="text-xl font-medium">{pageTitle}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 p-1">
            <span className="flex h-full w-full items-center justify-center text-xs font-medium text-primary">
              ME
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
