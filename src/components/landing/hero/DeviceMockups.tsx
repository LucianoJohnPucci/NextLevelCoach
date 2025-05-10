
import React from "react";
import { motion } from "framer-motion";

const DeviceMockups = () => {
  return (
    <motion.div 
      className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      {/* Laptop Mockup - Enhanced 3D Effect */}
      <div className="relative max-w-2xl transform perspective-1000 hover:rotate-y-1 transition-transform duration-300 ease-in-out">
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px] shadow-xl transform rotate-x-2">
          <div className="h-[156px] md:h-[278px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src="/lovable-uploads/d60e726c-3598-45a5-901e-3e2bee673684.png"
              alt="CoreCultivate dashboard on laptop"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px] shadow-lg transform -rotate-x-1">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
        </div>
      </div>

      {/* Tablet Mockup - Enhanced 3D with Better Fitting Image */}
      <div className="relative transform perspective-1000 hover:rotate-y-2 transition-transform duration-300 ease-in-out">
        <div className="relative mx-auto border-gray-900 dark:border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[454px] w-[304px] shadow-xl transform rotate-y-3">
          <div className="h-[426px] w-[276px] bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden">
            <div className="h-full w-full relative">
              <img
                src="/lovable-uploads/d60e726c-3598-45a5-901e-3e2bee673684.png"
                alt="CoreCultivate features on tablet"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Tablet Screen Glare Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none"></div>
            </div>
          </div>
          <div className="absolute top-[156px] right-[-16px] h-[32px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-l-lg"></div>
          <div className="absolute top-[196px] right-[-16px] h-[46px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-l-lg"></div>
          <div className="absolute top-[266px] right-[-16px] h-[46px] w-[3px] bg-gray-800 dark:bg-gray-600 rounded-l-lg"></div>
          {/* Tablet Shadow */}
          <div className="absolute -bottom-3 -left-3 -right-3 h-6 bg-black/20 blur-xl rounded-full z-[-1]"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeviceMockups;
