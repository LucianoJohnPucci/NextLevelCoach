
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Our Users Say
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            See how CoreCultivate has helped people transform their lives and find balance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-background">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
              </div>
              <p className="mb-4 italic text-muted-foreground">
                "CoreCultivate has completely transformed my approach to wellness. The mind-body-soul framework has helped me create balance in ways I never thought possible."
              </p>
              <div>
                <p className="font-bold">Sarah L.</p>
                <p className="text-sm text-muted-foreground">Marketing Director</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
              </div>
              <p className="mb-4 italic text-muted-foreground">
                "I've tried many wellness apps, but this is the first one that addresses all aspects of wellbeing in one place. The habit tracking feature has been game-changing for me."
              </p>
              <div>
                <p className="font-bold">Michael T.</p>
                <p className="text-sm text-muted-foreground">Software Engineer</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
                <Star className="h-5 w-5 fill-primary text-primary" />
              </div>
              <p className="mb-4 italic text-muted-foreground">
                "As a busy parent, I never made time for my own wellbeing. CoreCultivate's simple daily practices have helped me carve out moments for myself that make a huge difference."
              </p>
              <div>
                <p className="font-bold">Emma R.</p>
                <p className="text-sm text-muted-foreground">Elementary Teacher</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
