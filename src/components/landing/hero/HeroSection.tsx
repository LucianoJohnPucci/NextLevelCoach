
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DeviceMockups from "./DeviceMockups";

const HeroSection = () => {
  return (
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
        <DeviceMockups />
      </div>
    </section>
  );
};

export default HeroSection;
