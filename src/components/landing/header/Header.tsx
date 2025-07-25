
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Info, 
  Key, 
  Mail,
  Sparkles 
} from "lucide-react";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">
            <span className="text-black">Next Level</span>
            <span className="text-primary"> Coach</span>
          </span>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Info className="mr-2 h-4 w-4" />
                About
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/10 to-primary/5 p-6 no-underline outline-none focus:shadow-md"
                        href="#about"
                      >
                        <Sparkles className="h-6 w-6 text-primary" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Next Level Coach
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          A holistic wellness platform to nurture your mind, body, and soul through mindfulness, habits, and personal growth.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="#philosophy"
                      >
                        <div className="text-sm font-medium leading-none">Philosophy</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Our core beliefs and approach to wellbeing
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="#team"
                      >
                        <div className="text-sm font-medium leading-none">Our Team</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Meet the experts behind CoreCultivate
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Key className="mr-2 h-4 w-4" />
                Key Features
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/10 to-primary/5 p-6 no-underline outline-none focus:shadow-md"
                        href="#features"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Powerful Features
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Explore the tools that will help you cultivate a better life through mind, body, and soul balance.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="#mind"
                      >
                        <div className="text-sm font-medium leading-none">Mind</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Mental exercises, meditation guides, and personal journaling
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="#body"
                      >
                        <div className="text-sm font-medium leading-none">Body</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Workout routines, nutrition tracking, and health scheduling tools
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="#soul"
                      >
                        <div className="text-sm font-medium leading-none">Soul</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Inspirational content, spiritual exercises, and community connections
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="flex select-none items-center gap-3 rounded-md p-3 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="#contact"
                      >
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium leading-none">Contact</p>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get in touch with our support team
                          </p>
                        </div>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Log In</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Sign Up Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
