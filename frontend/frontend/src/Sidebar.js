import { useState } from 'react';
import { FaHome, FaHeartbeat, FaInfoCircle, FaHistory } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Dashboard', icon: <FaHome /> },
    { name: 'Prediction', icon: <FaHeartbeat /> },
    { name: 'History', icon: <FaHistory /> },
    { name: 'About', icon: <FaInfoCircle /> }
  ];

  return (
    <aside className="w-full sm:w-64 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen p-4 shadow-md">
      <div className="text-2xl font-semibold mb-6">Menu</div>
      <ul className="space-y-4">
        {tabs.map((tab) => (
          <li
            key={tab.name}
            className={`flex items-center space-x-2 cursor-pointer p-2 rounded transition duration-200 ${
              activeTab === tab.name
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
