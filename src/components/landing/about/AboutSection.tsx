
import React from "react";

const AboutSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              About
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              A New Approach to Wellbeing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our comprehensive platform integrates mental, physical, and spiritual dimensions of health, helping you achieve true wellbeing through personalized guidance and scientifically-backed methods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
