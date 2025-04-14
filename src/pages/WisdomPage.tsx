
import { motion } from "framer-motion";
import ChatBox from "@/components/wisdom/ChatBox";
import DailyWisdom from "@/components/wisdom/DailyWisdom";

const WisdomPage = () => {
  return (
    <div className="space-y-6">
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Wisdom</h1>
        <p className="text-muted-foreground">
          Seek guidance from stoic philosophy and timeless wisdom.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ChatBox />
        <DailyWisdom />
      </div>
    </div>
  );
};

export default WisdomPage;
