// src/components/Tabs.js
import React from 'react';
import { motion } from 'framer-motion';

const Tabs = ({ currentTab, setCurrentTab }) => {
  const tabs = ['Dashboard', 'Predict', 'About'];

  return (
    <div className="flex space-x-4 justify-center mb-6">
      {tabs.map((tab) => (
        <motion.button
          key={tab}
          onClick={() => setCurrentTab(tab)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentTab === tab
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          {tab}
        </motion.button>
      ))}
    </div>
  );
};

export default Tabs;
