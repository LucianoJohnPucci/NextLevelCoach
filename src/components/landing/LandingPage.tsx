
import React from "react";
import Header from "./header/Header";
import FeatureSection from "./features/FeatureSection";
import DeviceMockups from "./hero/DeviceMockups";
import MethodologySection from "./methodology/MethodologySection";
import TestimonialsSection from "./testimonials/TestimonialsSection";
import CtaSection from "./cta/CtaSection";
import ContactSection from "./contact/ContactSection";
import Footer from "./footer/Footer";

/**
 * The LandingPage component
 * This is the main component that assembles all sections of the landing page
 */
const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Header with navigation */}
      <Header />

      {/* Main content sections */}
      <FeatureSection />
      <MethodologySection />
      <DeviceMockups />
      <TestimonialsSection />
      <CtaSection />
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
