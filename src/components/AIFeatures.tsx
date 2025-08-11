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
  const [tone, setTone] = useState<'professional' | 'casual' | 'engaging'>('engaging');
  const [language, setLanguage] = useState('en');

  const generateCaption = async () => {
    if (!keywords.trim()) return;
    
    setIsGeneratingCaption(true);
    
    try {
      const response = await fetch('/api/ai/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keywords,
          platforms: selectedPlatforms,
          tone,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onCaptionGenerated(data.caption);
      } else {
        // Fallback to sample captions
        const sampleCaptions = [
          `🚀 Exciting news! We're taking ${keywords} to the next level with innovative solutions that will transform the way you work. Stay tuned for amazing updates! #innovation #technology #growth`,
          `✨ Discover the power of ${keywords}! Our latest breakthrough is here to revolutionize your experience. Join thousands who are already seeing incredible results! #breakthrough #success #future`,
          `💡 Ready to unlock new possibilities with ${keywords}? We're passionate about creating solutions that make a real difference in your daily life. Let's build something amazing together! #passion #solutions #community`,
        ];
        const randomCaption = sampleCaptions[Math.floor(Math.random() * sampleCaptions.length)];
        onCaptionGenerated(randomCaption);
      }
    } catch (error) {
      console.error('Error generating caption:', error);
      // Fallback to sample captions
      const sampleCaptions = [
        `🚀 Exciting news! We're taking ${keywords} to the next level with innovative solutions that will transform the way you work. Stay tuned for amazing updates! #innovation #technology #growth`,
      ];
      onCaptionGenerated(sampleCaptions[0]);
    }
    
    setIsGeneratingCaption(false);
  };

  const generateHashtags = async () => {
    if (!keywords.trim()) return;
    
    setIsGeneratingHashtags(true);
    
    try {
      const response = await fetch('/api/ai/generate-hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          keywords,
          platforms: selectedPlatforms,
          count: 8,
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onHashtagsGenerated(data.hashtags);
      } else {
        // Fallback to sample hashtags
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
      }
    } catch (error) {
      console.error('Error generating hashtags:', error);
      // Fallback to sample hashtags
      const hashtags = [
        `#${keywords.replace(/\s+/g, '')}`,
        '#trending',
        '#viral',
      ];
      onHashtagsGenerated(hashtags);
    }
    
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as 'professional' | 'casual' | 'engaging')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="engaging">Engaging</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
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
          <p className="font-medium mb-1">🤖 DeepSeek AI Integration</p>
          <p>Powered by DeepSeek AI for intelligent content generation based on your keywords, selected platforms, and preferred tone.</p>
        </div>
      </div>
    </div>
  );
}