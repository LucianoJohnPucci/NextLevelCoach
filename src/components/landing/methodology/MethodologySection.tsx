
import React from "react";

const MethodologySection = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Methodology
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Holistic Approach to Wellbeing
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our proprietary methodology combines ancient wisdom with modern science, addressing all dimensions of your wellbeing through integrated practices and personalized coaching.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 pt-12">
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H20a2 2 0 0 1 2 2v10Z"></path>
                <path d="M22 7v10"></path>
                <path d="M6.5 5C6.5 3 7.5 2 9 2h6c1.5 0 2.5 1 2.5 3"></path>
                <path d="M12 12v5"></path>
                <path d="M10 14l2-2 2 2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Scientific Foundation</h3>
            <p className="text-sm text-muted-foreground text-center">
              Built on evidence-based research in psychology, physiology, and behavioral science.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Personalized Approach</h3>
            <p className="text-sm text-muted-foreground text-center">
              Tailored recommendations that adapt to your unique needs, preferences, and progress.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4">
            <div className="rounded-full bg-primary p-2 text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold">Integrated Practices</h3>
            <p className="text-sm text-muted-foreground text-center">
              Combining mindfulness, physical activity, nutrition, and purpose-driven living for whole-person wellbeing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;
