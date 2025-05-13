
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="w-full py-12 md:py-24 bg-primary/10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4 max-w-[800px]">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Transform Your Life in 5 Years
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Join thousands who have used Next Level Coach's methodology to achieve their financial, health, mental, and spiritual goals.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/auth">
                Begin Your 5-Year Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required. Free plan available with premium upgrade options.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
