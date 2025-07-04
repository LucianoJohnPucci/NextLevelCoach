
import { motion } from "framer-motion";
import ChatBox from "@/components/wisdom/ChatBox";
import DailyWisdom from "@/components/wisdom/DailyWisdom";
import CommandChatBox from "@/components/wisdom/CommandChatBox";

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
          Seek guidance from stoic philosophy, break down your goals with AI assistance, and manage tasks with natural language commands.
        </p>
      </motion.div>
      
      {/* Task Command Interface */}
      <div className="grid grid-cols-1 gap-6">
        <CommandChatBox />
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
