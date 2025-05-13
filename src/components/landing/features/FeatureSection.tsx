
import React from "react";

const FeatureSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              All-in-one Wellbeing Platform
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform offers a comprehensive suite of tools designed to help you achieve true wellbeing in mind, body, and soul.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M17 3c-2.2 0-3.8.9-5 2.1C10.8 3.9 9.2 3 7 3 3.5 3 1 5.5 1 9c0 7 11 12 11 12s11-5 11-12c0-3.5-2.5-6-6-6Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Physical Wellbeing</h3>
            <p className="text-sm text-muted-foreground text-center">
              Personalized workout plans, nutrition guidance, and health metrics tracking to optimize your physical health.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a4 4 0 0 0 0 8 4 4 0 0 1 0 8 4 4 0 0 0 0-8 4 4 0 0 1 0-8"></path>
                <path d="M12 22v-9.5"></path>
                <path d="M12 6V2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Mental Clarity</h3>
            <p className="text-sm text-muted-foreground text-center">
              Guided meditation, stress management tools, and journaling prompts to cultivate mental resilience.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
            <div className="rounded-full bg-primary/10 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m7 11 2.5-2.5c1.9-1.9 5.1-1.9 7 0 1.9 1.9 1.9 5.1 0 7L12 20"></path>
                <path d="M7 11h10"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Spiritual Growth</h3>
            <p className="text-sm text-muted-foreground text-center">
              Resources for exploring your values, finding purpose, and connecting with something greater than yourself.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
