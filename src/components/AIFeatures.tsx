import React, { useState } from 'react';
import { Sparkles, Hash, Loader, Wand2 } from 'lucide-react';

interface AIFeaturesProps {
  onCaptionGenerated: (caption: string) => void;
  onHashtagsGenerated: (hashtags: string[]) => void;
  selectedPlatforms: string[];
}

export default function AIFeatures({ onCaptionGenerated, onHashtagsGenerated, selectedPlatforms }: AIFeaturesProps) {
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [keywords, setKeywords] = useState('');

  const generateCaption = async () => {
    if (!keywords.trim()) return;
    
    setIsGeneratingCaption(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleCaptions = [
      `🚀 Exciting news! We're taking ${keywords} to the next level with innovative solutions that will transform the way you work. Stay tuned for amazing updates! #innovation #technology #growth`,
      `✨ Discover the power of ${keywords}! Our latest breakthrough is here to revolutionize your experience. Join thousands who are already seeing incredible results! #breakthrough #success #future`,
      `💡 Ready to unlock new possibilities with ${keywords}? We're passionate about creating solutions that make a real difference in your daily life. Let's build something amazing together! #passion #solutions #community`,
    ];
    
    const randomCaption = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)];
    onCaptionGenerated(randomCaption);
    setIsGeneratingCaption(false);
  };

  const generateHashtags = async () => {
    if (!keywords.trim()) return;
    
    setIsGeneratingHashtags(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const hashtags = [
      `#${keywords.replace(/\s+/g, '')}`,
      '#trending',
      '#viral',
      '#socialmedia',
      '#content',
      '#engagement',
      '#digital',
      '#marketing',
    ];
    
    onHashtagsGenerated(hashtags);
    setIsGeneratingHashtags(false);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI-Powered Content Generation</h3>
          <p className="text-sm text-gray-600">Generate engaging captions and trending hashtags</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
            Keywords/Topic (for AI generation)
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., product launch, team collaboration, industry insights"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={generateCaption}
            disabled={!keywords.trim() || isGeneratingCaption}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGeneratingCaption ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {isGeneratingCaption ? 'Generating...' : 'Generate Caption'}
          </button>

          <button
            type="button"
            onClick={generateHashtags}
            disabled={!keywords.trim() || isGeneratingHashtags}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGeneratingHashtags ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Hash className="w-4 h-4 mr-2" />
            )}
            {isGeneratingHashtags ? 'Generating...' : 'Generate Hashtags'}
          </button>
        </div>

        <div className="text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-200">
          <p className="font-medium mb-1">🤖 AI Integration Placeholder</p>
          <p>Future integration with OpenAI GPT-4 or Claude API for intelligent content generation based on your brand voice and trending topics.</p>
        </div>
      </div>
    </div>
  );
}