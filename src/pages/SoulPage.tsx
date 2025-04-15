
import { motion } from "framer-motion";
import PracticesSection from "@/components/soul/PracticesSection";
import ReadingsSection from "@/components/soul/ReadingsSection";
import GuidedPracticesSection from "@/components/soul/GuidedPracticesSection";
import InspirationSection from "@/components/soul/InspirationSection";
import CommunityEventsSection from "@/components/soul/CommunityEventsSection";

const SoulPage = () => {
  const readings = [
    {
      title: "Meditations",
      author: "Marcus Aurelius",
      duration: "15 min",
      minutes: 15,
      isFavorite: true
    },
    {
      title: "Letters from a Stoic",
      author: "Seneca",
      duration: "20 min",
      minutes: 20,
      isFavorite: false
    },
    {
      title: "The Enchiridion",
      author: "Epictetus",
      duration: "10 min",
      minutes: 10,
      isFavorite: true
    }
  ];
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Soul</h1>
        <p className="text-muted-foreground">
          Resources for spiritual growth and inner peace.
        </p>
      </motion.div>
      
      <PracticesSection />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <ReadingsSection readings={readings} />
        </div>
        
        <div>
          <GuidedPracticesSection />
        </div>
      </div>
      
      <CommunityEventsSection />
      
      <InspirationSection />
    </div>
  );
};

export default SoulPage;
