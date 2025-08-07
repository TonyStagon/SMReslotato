import React from 'react';
import { socialPlatforms } from '../data/mockData';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
}

export default function PlatformSelector({ selectedPlatforms, onPlatformChange }: PlatformSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onPlatformChange(selectedPlatforms.filter(p => p !== platformId));
    } else {
      onPlatformChange([...selectedPlatforms, platformId]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Platforms</h3>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {socialPlatforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`bg-gradient-to-r ${platform.color} text-white text-2xl w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                {platform.icon}
              </div>
              <p className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                {platform.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {platform.maxChars} chars
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}