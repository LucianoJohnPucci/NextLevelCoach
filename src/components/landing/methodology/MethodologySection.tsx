import React from "react";
import { ArrowRight, Calendar, Award, Clock, Star, Repeat, Heart, Brain, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MethodologySection = () => {
  return (
    <section id="methodology" className="w-full py-12 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            Our Approach
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Your 5-Year Transformation Plan
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
            You tell us where you want to be in 5 years, and we'll help you get there through a proven methodology.
          </p>
        </div>

        {/* Goal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-background rounded-lg p-6 border border-primary/10 shadow-sm"
          >
            <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Star className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Financial Goal</h3>
            <p className="text-muted-foreground mb-4">
              Build wealth, manage budgets, and create financial freedom with personalized strategies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-background rounded-lg p-6 border border-primary/10 shadow-sm"
          >
            <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Health Goal</h3>
            <p className="text-muted-foreground mb-4">
              Optimize your physical wellbeing through nutrition, exercise, and recovery practices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-background rounded-lg p-6 border border-primary/10 shadow-sm"
          >
            <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Mental Goal</h3>
            <p className="text-muted-foreground mb-4">
              Enhance focus, clarity, and cognitive performance through proven mental training techniques.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-background rounded-lg p-6 border border-primary/10 shadow-sm"
          >
            <div className="rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Star className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Spiritual Stoic Level</h3>
            <p className="text-muted-foreground mb-4">
              Develop resilience, mindfulness, and inner peace through philosophical wisdom and practices.
            </p>
          </motion.div>
        </div>

        {/* Process Timeline */}
        <div className="space-y-16 mb-16">
          <div className="text-center space-y-4 mb-10">
            <h3 className="text-2xl font-bold">Our Proven Transformation Process</h3>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              We've developed a systematic approach to help you achieve lasting change and reach your goals.
            </p>
          </div>

          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 z-0 hidden md:block"></div>
            
            <div className="space-y-24 relative z-10">
              {/* Discovery Phase */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/2 text-right md:pr-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm relative md:ml-auto md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">Discovery Questions</h4>
                    <p className="text-muted-foreground">
                      We begin with in-depth discovery questions to understand your goals, challenges, and personal values.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-12 h-12 items-center justify-center">
                  <Search className="h-6 w-6" />
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">Custom Plan Building</h4>
                    <p className="text-muted-foreground">
                      Based on your responses, we create a personalized roadmap with actionable steps tailored to you.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Foundation Building */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/2 text-right md:pr-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm relative md:ml-auto md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">Time Blocking</h4>
                    <p className="text-muted-foreground">
                      Learn to protect your time from external demands and create space for meaningful growth.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-12 h-12 items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">Demand Balance Calculator</h4>
                    <p className="text-muted-foreground">
                      Use our tool to analyze how you're spending your energy and rebalance for optimal performance.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Habit Transformation */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/2 text-right md:pr-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm relative md:ml-auto md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">60-Day Habit Swap</h4>
                    <p className="text-muted-foreground">
                      Replace negative habits with positive ones through our proven 60-day methodology.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-12 h-12 items-center justify-center">
                  <Repeat className="h-6 w-6" />
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">Micro Skill Development</h4>
                    <p className="text-muted-foreground">
                      Master small, high-impact habits and skills that compound over time for dramatic results.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Long-term Transformation */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/2 text-right md:pr-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm relative md:ml-auto md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">1-Year Sprint</h4>
                    <p className="text-muted-foreground">
                      Focus intensely on rapid progress in key areas with quarterly reviews and adjustments.
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-12 h-12 items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm md:max-w-md">
                    <h4 className="text-xl font-bold mb-2">2-Year Skill Stacking</h4>
                    <p className="text-muted-foreground">
                      Double your impact by combining complementary skills and habits for exponential growth.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Deep Change */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="hidden md:flex bg-primary text-primary-foreground rounded-full w-12 h-12 items-center justify-center mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm max-w-xl text-center">
                  <h4 className="text-xl font-bold mb-2">5-Year Deep Change</h4>
                  <p className="text-muted-foreground">
                    Experience profound transformation across all areas of your life as your consistent efforts compound into lasting change.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto bg-primary/10 p-8 rounded-xl"
        >
          <h3 className="text-2xl font-bold mb-4">Start Your 5-Year Journey Today</h3>
          <p className="text-muted-foreground mb-6">
            Take the first step toward becoming the person you want to be five years from now. Our structured approach makes sustainable change possible.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/auth">
              Begin Your Transformation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MethodologySection;
