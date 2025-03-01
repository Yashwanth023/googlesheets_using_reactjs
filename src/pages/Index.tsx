
import React from "react";
import Spreadsheet from "@/components/Spreadsheet";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.header 
        className="border-b border-border bg-sheet-toolbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.h1 
            className="text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Calcultopia
          </motion.h1>
        </div>
      </motion.header>
      
      <motion.main 
        className="flex-1 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Spreadsheet />
      </motion.main>
    </div>
  );
};

export default Index;
