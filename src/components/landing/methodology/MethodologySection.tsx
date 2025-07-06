import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Heart, Brain, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MethodologySection = () => {
  return (
    <section id="methodology" className="w-full py-12 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            Our Approach
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Our AI-Assisted Approach
          </h2>
          <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
            Our approach weaves together disciplined training of the <strong>Body</strong>, focused expansion of the <strong>Mind</strong>, and daily nourishment of the <strong>Soul</strong>—forging the next-level you one intentional step at a time.
          </p>
        </div>

        {/* Goal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Financial */}
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
            <h3 className="text-xl font-bold mb-2">Sleep Patterns</h3>
            <p className="text-muted-foreground mb-4">
              Track your nightly sleep cycles and leverage insights to improve recovery and performance.
            </p>
            <img src="/screenshots/sleep.png" alt="Sleep Patterns" className="mx-auto mt-2 max-h-72" />
          </motion.div>

          {/* Health */}
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
            <h3 className="text-xl font-bold mb-2">Body Goals</h3>
            <p className="text-muted-foreground mb-4">
              Optimize your physical wellbeing through nutrition, exercise, and recovery practices.
            </p>
            <img src="/screenshots/body.png" alt="Body Goals" className="mx-auto mt-2 max-h-72" />
          </motion.div>

          {/* Mental */}
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
            <img src="/screenshots/mind.png" alt="Mental Goal" className="mx-auto mt-2 max-h-72" />
          </motion.div>

          {/* Spiritual */}
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
            <img src="/screenshots/soul.png" alt="Spiritual Stoic Level" className="mx-auto mt-2 max-h-72" />
          </motion.div>
        </div>

        {/* Transformation Processes */}
        <div className="space-y-16 mb-16">
          <div className="text-center space-y-4 mb-10">
            <h3 className="text-2xl font-bold">Our Proven Transformation Process</h3>
            <p className="text-muted-foreground max-w-[700px] mx-auto">
              We've developed multiple proven paths so you can choose the cadence that fits your life.
            </p>
          </div>

          {/* Discovery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm text-center">
              <h4 className="text-xl font-bold mb-2">Discovery Questions</h4>
              <p className="text-muted-foreground">
                We begin with in-depth questions to understand your goals, challenges, and personal values.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm text-center">
              <h4 className="text-xl font-bold mb-2">Custom Plan Building</h4>
              <p className="text-muted-foreground">
                Based on your responses, we create a personalized roadmap with actionable steps.
              </p>
            </div>
          </motion.div>

          {/* Three Paths */}
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-6"
            >
              <h4 className="text-lg font-bold bg-primary/10 px-4 py-2 rounded-full">60-Day Habit Swap</h4>
              <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm w-full text-center">
                <p className="text-muted-foreground">
                  Replace negative habits with positive ones through our proven 60-day methodology.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm w-full text-center">
                <p className="text-muted-foreground">
                  Master micro-skills that compound quickly for dramatic results.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-6"
            >
              <h4 className="text-lg font-bold bg-primary/10 px-4 py-2 rounded-full">1-Year Sprint</h4>
              <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm w-full text-center">
                <p className="text-muted-foreground">
                  Focus intensely on rapid progress in key areas with quarterly reviews and adjustments.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm w-full text-center">
                <p className="text-muted-foreground">
                  Time-blocking & demand-balance tools ensure sustainable momentum.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-6"
            >
              <h4 className="text-lg font-bold bg-primary/10 px-4 py-2 rounded-full">2-Year Skill Stacking</h4>
              <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm w-full text-center">
                <p className="text-muted-foreground">
                  Combine complementary skills and habits for exponential growth.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm w-full text-center">
                <p className="text-muted-foreground">
                  Quarterly micro-skill projects build layered expertise.
                </p>
              </div>
            </motion.div>
          </div>

          {/* 5-Year Outcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mt-16"
          >
            <div className="bg-background p-6 rounded-lg border border-primary/10 shadow-sm max-w-xl text-center">
              <h4 className="text-xl font-bold mb-2">5-Year Deep Change</h4>
              <p className="text-muted-foreground">
                Experience profound transformation across all areas of your life as consistent efforts compound into lasting change.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
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
            <Link to="/signup">Try our FORGE <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MethodologySection;
