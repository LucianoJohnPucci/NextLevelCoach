
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Heart, Sparkles } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            Why Do You Need It
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Balance in a Chaotic World
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            In today's fast-paced world, finding balance is more challenging—and more essential—than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-background border-primary/10">
            <CardContent className="pt-6">
              <div className="mb-4 rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mental Clarity</h3>
              <p className="text-muted-foreground">
                Modern life bombards us with information and demands our constant attention. Next Level Coach helps you find mental space to think clearly.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-primary/10">
            <CardContent className="pt-6">
              <div className="mb-4 rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Physical Wellbeing</h3>
              <p className="text-muted-foreground">
                Sedentary lifestyles and poor nutrition affect our energy and health. Our tools help you build sustainable physical habits.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-background border-primary/10">
            <CardContent className="pt-6">
              <div className="mb-4 rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spiritual Growth</h3>
              <p className="text-muted-foreground">
                Modern life can disconnect us from meaning and purpose. Next Level Coach helps you reconnect with your deeper values.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
