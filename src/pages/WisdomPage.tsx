
import { motion } from "framer-motion";
import ChatBox from "@/components/wisdom/ChatBox";
import DailyWisdom from "@/components/wisdom/DailyWisdom";
import PrioritizeBox from "@/components/wisdom/PrioritizeBox";

const WisdomPage = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Double Chat AI - Goals & Wisdom</h1>
        <p className="text-muted-foreground">
          Seek guidance from stoic philosophy and break down your goals with AI assistance.
        </p>
      </motion.div>
      
      {/* Prioritize Box Section */}
      <div className="grid grid-cols-1 gap-6">
        <PrioritizeBox />
      </div>
      
      {/* Original Chat and Daily Wisdom Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ChatBox />
        <DailyWisdom />
      </div>
    </div>
  );
};

export default WisdomPage;
