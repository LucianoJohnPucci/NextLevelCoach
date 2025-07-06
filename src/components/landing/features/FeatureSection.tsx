
import React from "react";
import { CheckCircle, Calendar, MessageSquare, BarChart2, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeatureSection = () => {
  return (
    <section id="features" className="w-full py-12 md:py-24 bg-slate-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            The Problem We Solve
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            Staying On Track With Your Goals
          </h2>
          <p className="max-w-[700px] text-slate-300 md:text-xl/relaxed">
            Life's demands constantly challenge your progress. We provide the structure and support you need to maintain discipline and achieve results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-4">Common Challenges</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 rounded-full bg-red-500/10 p-1">
                  <Clock className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Inconsistent Routine</h4>
                  <p className="text-slate-300">Work, family, and daily responsibilities constantly disrupt your wellness plans.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 rounded-full bg-red-500/10 p-1">
                  <TrendingUp className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Lack of Accountability</h4>
                  <p className="text-slate-300">Without proper tracking and reminders, goals become forgotten intentions.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 rounded-full bg-red-500/10 p-1">
                  <BarChart2 className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Progress Blindness</h4>
                  <p className="text-slate-300">Can't see small improvements, leading to demotivation and abandoning goals.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 rounded-lg p-8 border border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-4">Our Solution</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 rounded-full bg-primary/10 p-1">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Daily Check-ins</h4>
                  <p className="text-slate-300">Simple, quick daily inputs keep you connected to your goals even on busy days.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 rounded-full bg-primary/10 p-1">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-white">AI Encouragement</h4>
                  <p className="text-slate-300">Personalized motivation and advice when you need it most to stay focused.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 rounded-full bg-primary/10 p-1">
                  <BarChart2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Progress Tracking</h4>
                  <p className="text-slate-300">Visualize your journey with detailed reports that highlight even small wins.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl text-slate-300 mb-6 max-w-[800px] mx-auto">
            <span className="font-bold text-primary">The edge you need:</span> Our discipline toolkit provides the structure, accountability and encouragement to help you accomplish what matters most—even when life tries to derail your progress.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <a href="/signup">Start Your Journey Today</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
