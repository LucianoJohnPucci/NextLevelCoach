
import React from "react";
import { CheckCircle, Brain, Heart, Sparkles } from "lucide-react";

const FeatureSection = () => {
  return (
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
  );
};

export default FeatureSection;
