
import React from "react";

const TestimonialsSection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Transformative Results
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Hear from our users who have experienced profound changes in their wellbeing journey.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          <div className="flex flex-col items-start space-y-4 rounded-xl bg-background p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-xl">SA</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Sarah A.</h3>
                <p className="text-sm text-muted-foreground">Marketing Executive</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "I was overwhelmed by stress and burnout before finding this platform. The daily meditation practices and personalized wellbeing plan have completely transformed my relationship with work and life balance."
            </p>
          </div>
          <div className="flex flex-col items-start space-y-4 rounded-xl bg-background p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-xl">MK</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Michael K.</h3>
                <p className="text-sm text-muted-foreground">Software Engineer</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "As someone who spent all day at a computer, I was experiencing physical discomfort and mental fatigue. The integrated approach to wellness helped me establish better work habits and find more meaning in what I do."
            </p>
          </div>
          <div className="flex flex-col items-start space-y-4 rounded-xl bg-background p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-xl">JL</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Jennifer L.</h3>
                <p className="text-sm text-muted-foreground">Healthcare Professional</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "Working in healthcare during the pandemic left me emotionally drained. The soul nourishment tools and community support have been essential for reconnecting with my purpose and finding joy again."
            </p>
          </div>
          <div className="flex flex-col items-start space-y-4 rounded-xl bg-background p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary text-xl">DP</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">David P.</h3>
                <p className="text-sm text-muted-foreground">Small Business Owner</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              "The goal-setting framework and accountability features have helped me make consistent progress on my wellbeing while managing the demands of running a business. I've never felt more centered and productive."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
