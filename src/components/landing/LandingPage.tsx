
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Info, 
  Key, 
  Mail,
  Star, 
  CheckCircle, 
  ArrowRight, 
  Brain, 
  Heart, 
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
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CoreCultivate</span>
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
                            CoreCultivate
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
              <Link to="/auth">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 md:px-6 space-y-12">
          <div className="flex flex-col items-center space-y-8 text-center">
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Nurture Your Mind, Body, and Soul
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                CoreCultivate helps you track your mental wellbeing, build healthy habits, and access wisdom to guide your personal growth journey.
              </p>
            </motion.div>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button asChild size="lg">
                <Link to="/auth">Start Your Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features">Explore Features</a>
              </Button>
            </motion.div>
          </div>

          {/* Device Mockups with the uploaded app screenshot */}
          <motion.div 
            className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Laptop Mockup */}
            <div className="relative max-w-2xl">
              <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                <div className="h-[156px] md:h-[278px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src="/lovable-uploads/d60e726c-3598-45a5-901e-3e2bee673684.png"
                    alt="CoreCultivate dashboard on laptop"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
              </div>
            </div>

            {/* Tablet Mockup */}
            <div className="relative">
              <div className="relative mx-auto border-gray-900 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[454px] w-[304px] shadow-xl">
                <div className="h-[426px] w-[276px] bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden">
                  <img
                    src="/lovable-uploads/d60e726c-3598-45a5-901e-3e2bee673684.png"
                    alt="CoreCultivate features on tablet"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute top-[156px] right-[-16px] h-[32px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-l-lg"></div>
                <div className="absolute top-[196px] right-[-16px] h-[46px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-l-lg"></div>
                <div className="absolute top-[266px] right-[-16px] h-[46px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-l-lg"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Do You Need It */}
      <section id="about" className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Why Do You Need It
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Balance in a Chaotic World
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              In today's fast-paced world, finding balance is more challenging—and more essential—than ever before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background border-primary/10">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mental Clarity</h3>
                <p className="text-muted-foreground">
                  Modern life bombards us with information and demands our constant attention. CoreCultivate helps you find mental space to think clearly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-primary/10">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Physical Wellbeing</h3>
                <p className="text-muted-foreground">
                  Sedentary lifestyles and poor nutrition affect our energy and health. Our tools help you build sustainable physical habits.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-primary/10">
              <CardContent className="pt-6">
                <div className="mb-4 rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Spiritual Growth</h3>
                <p className="text-muted-foreground">
                  Modern life can disconnect us from meaning and purpose. CoreCultivate helps you reconnect with your deeper values.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your Complete Wellness Platform
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              CoreCultivate offers a comprehensive suite of tools designed to nurture every aspect of your wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div id="mind" className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <Brain className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold mb-2">Mind</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Guided meditation sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Journal prompts and reflection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Mental health tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Cognitive exercises</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div id="body" className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <Heart className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold mb-2">Body</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Workout routines and tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Nutrition guidance and logs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Sleep quality monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Physical metrics dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div id="soul" className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <h3 className="text-xl font-bold mb-2">Soul</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Inspirational content library</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Community events and groups</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Guided spiritual practices</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Personal value exploration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Benefits
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Transform Your Life
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Experience the profound changes that come from consistent attention to all dimensions of your wellbeing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-background border-primary/10">
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-bold mb-4">Reduced Stress</h3>
                <p className="text-muted-foreground">
                  Regular mindfulness practice and physical activity help lower cortisol levels and improve your body's stress response.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-primary/10">
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-bold mb-4">Better Sleep</h3>
                <p className="text-muted-foreground">
                  Improved habits and evening routines lead to more restful sleep and higher energy levels throughout the day.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-primary/10">
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-bold mb-4">Increased Focus</h3>
                <p className="text-muted-foreground">
                  Mental clarity exercises help improve concentration and productivity in all areas of your life.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-primary/10">
              <CardContent className="pt-6 text-center">
                <h3 className="text-xl font-bold mb-4">Greater Purpose</h3>
                <p className="text-muted-foreground">
                  Connecting with your values helps you make decisions that align with your authentic self and life goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              What Our Users Say
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              See how CoreCultivate has helped people transform their lives and find balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <p className="mb-4 italic text-muted-foreground">
                  "CoreCultivate has completely transformed my approach to wellness. The mind-body-soul framework has helped me create balance in ways I never thought possible."
                </p>
                <div>
                  <p className="font-bold">Sarah L.</p>
                  <p className="text-sm text-muted-foreground">Marketing Director</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <p className="mb-4 italic text-muted-foreground">
                  "I've tried many wellness apps, but this is the first one that addresses all aspects of wellbeing in one place. The habit tracking feature has been game-changing for me."
                </p>
                <div>
                  <p className="font-bold">Michael T.</p>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                  <Star className="h-5 w-5 fill-primary text-primary" />
                </div>
                <p className="mb-4 italic text-muted-foreground">
                  "As a busy parent, I never made time for my own wellbeing. CoreCultivate's simple daily practices have helped me carve out moments for myself that make a huge difference."
                </p>
                <div>
                  <p className="font-bold">Emma R.</p>
                  <p className="text-sm text-muted-foreground">Elementary Teacher</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-12 md:py-24 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 max-w-[800px]">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Begin Your Wellness Journey Today
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Join thousands of others who have transformed their lives with CoreCultivate's holistic approach to wellbeing.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required. Free plan available with premium upgrade options.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Contact Us
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              We'd Love to Hear From You
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Have questions or feedback? Our team is here to help you on your wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Email Us</h3>
                  <p className="text-muted-foreground">support@corecultivate.com</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Office Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9am - 5pm EST</p>
                <p className="text-muted-foreground">Saturday: 10am - 2pm EST</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Support</h3>
                <p className="text-muted-foreground">
                  Our support team typically responds within 24 hours during business days.
                </p>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Name
                      </label>
                      <input
                        id="name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Subject
                    </label>
                    <input
                      id="subject"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-muted">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CoreCultivate</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 CoreCultivate. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
