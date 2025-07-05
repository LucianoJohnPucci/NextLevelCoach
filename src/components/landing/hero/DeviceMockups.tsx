
import React from "react";
import { motion } from "framer-motion";

const DeviceMockups = () => {
  return (
    <motion.div 
      className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12 w-full max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      {/* Laptop Mockup - Enhanced 3D Effect */}
      <div className="relative w-full max-w-none min-h-[500px] flex-1 flex flex-col">
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl w-full h-auto shadow-xl transform rotate-x-2">
          <p className="text-center text-muted-foreground text-sm mb-2">Leverage AI chat to help you prioritize your goals and tasks, while a second agent offers insights on higher-level stoic philosophies.</p>
            <div className="w-full h-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src="/screenshots/Ai chat.png"
              alt="AI chat helping prioritize goals and stoic philosophy"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] w-full max-w-4xl shadow-lg transform -rotate-x-1">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
        </div>
      </div>

      {/* Landscape Tablet Mockup - Enhanced 3D with Edge-to-Edge Image */}
      <div className="relative w-full max-w-none min-h-[500px] flex-1 flex flex-col">
        <div className="relative mx-auto border-gray-900 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] w-full h-auto shadow-xl transform rotate-y-3">
          <p className="text-center text-muted-foreground text-sm mb-2">Tracking your sleep is essential for optimizing your health, focus, and long-term progress.</p>
            <div className="w-full min-h-[300px] flex items-center justify-center bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden">
            <div className="w-full h-auto flex items-center justify-center">
              <img
                src="/screenshots/sleep.png"
                alt="Sleep tracking screenshot"
                className="w-full h-auto object-contain"
              />
              {/* Tablet Screen Glare Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 pointer-events-none"></div>
            </div>
          </div>
          {/* Move buttons to the side for landscape orientation */}
          <div className="absolute top-[50px] left-[-16px] h-[32px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-r-lg"></div>
          <div className="absolute top-[100px] left-[-16px] h-[46px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-r-lg"></div>
          <div className="absolute top-[170px] left-[-16px] h-[46px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-r-lg"></div>
          {/* Tablet Shadow */}
          <div className="absolute -bottom-4 -left-4 -right-4 h-6 bg-black/20 blur-xl rounded-full z-[-1]"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeviceMockups;
