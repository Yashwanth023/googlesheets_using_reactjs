
import React from "react";
import Spreadsheet from "@/components/Spreadsheet";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.header 
        className="border-b border-border bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <img 
              src="https://www.gstatic.com/images/branding/product/1x/sheets_2020q4_48dp.png"
              alt="Sheets Logo"
              className="h-6 w-6"
            />
            <h1 className="text-sm font-normal text-gray-700">Untitled spreadsheet</h1>
          </motion.div>
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
