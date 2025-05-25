import React from 'react';

interface SwitchProps {
  activeTab: 'compress' | 'decompress';
  onTabChange: (tab: 'compress' | 'decompress') => void;
}

const Switch: React.FC<SwitchProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-end items-center mb-8">
      <div className="flex gap-4">
        <button
          onClick={() => onTabChange('compress')}
          className={`px-4 py-2 ${
            activeTab === 'compress'
              ? 'text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Compress Audio File
        </button>
        <button
          onClick={() => onTabChange('decompress')}
          className={`px-4 py-2 ${
            activeTab === 'decompress'
              ? 'text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Decompress File
        </button>
      </div>
    </div>
  );
};

export default Switch;
