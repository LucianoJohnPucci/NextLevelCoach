
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const BenefitsSection = () => {
  return (
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
  );
};

export default BenefitsSection;
