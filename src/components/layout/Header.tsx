
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarProvider";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import { UserProfileButton } from "../UserProfileButton";

const Header = () => {
  const { toggle } = useSidebar();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-black">Next Level</span>
              <span className="text-primary"> Coach</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
