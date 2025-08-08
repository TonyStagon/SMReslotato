import React, { useState } from 'react';
import { Calendar, Clock, Image, Sparkles, Hash, Instagram, Facebook, Twitter, Linkedin, Music } from 'lucide-react';
import { socialPlatforms } from '../data/mockData';
import { Post } from '../types';
import PlatformSelector from './PlatformSelector';
import AIFeatures from './AIFeatures';

interface PostComposerProps {
  onPostCreate: (post: Omit<Post, 'id' | 'createdAt'>) => void;
}

export default function PostComposer({ onPostCreate }: PostComposerProps) {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
        return Instagram;
      case 'Facebook':
        return Facebook;
      case 'Twitter':
        return Twitter;
      case 'Linkedin':
        return Linkedin;
      case 'Music':
        return Music;
      default:
        return Instagram;
    }
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.length === 0) return 2200;
    const limits = selectedPlatforms.map(pid => socialPlatforms.find(p => p.id === pid)?.maxChars || 2200);
    return Math.min(...limits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caption && selectedPlatforms.length > 0) {
      onPostCreate({
        caption,
        media: media || undefined,
        platforms: selectedPlatforms,
        scheduledDate: scheduleType === 'later' ? scheduledDate : undefined,
        status: scheduleType === 'now' ? 'published' : 'scheduled',
        analytics: {
          reach: 0,
          likes: 0,
          comments: 0,
          impressions: 0,
        },
      });
      // Reset form
      setCaption('');
      setMedia('');
      setSelectedPlatforms([]);
      setScheduledDate(undefined);
      setScheduleType('now');
    }
  };

  const characterLimit = getCharacterLimit();
  const isOverLimit = caption.length > characterLimit;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Selection */}
        <PlatformSelector
          selectedPlatforms={selectedPlatforms}
          onPlatformChange={setSelectedPlatforms}
        />

        {/* AI Features */}
        <AIFeatures
          onCaptionGenerated={setCaption}
          onHashtagsGenerated={(hashtags) => setCaption(prev => `${prev} ${hashtags.join(' ')}`)}
          selectedPlatforms={selectedPlatforms}
        />

        {/* Post Content */}
        <div className="space-y-4">
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
              Caption / Message
            </label>
            <textarea
              id="caption"
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                isOverLimit ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="What's happening?"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
                {caption.length} / {characterLimit} characters
              </p>
              {selectedPlatforms.length > 0 && (
                <div className="flex space-x-1">
                  {selectedPlatforms.map(pid => {
                    const platform = socialPlatforms.find(p => p.id === pid);
                    const IconComponent = platform ? getIconComponent(platform.icon) : Instagram;
                    return platform ? (
                      <span key={pid} className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${platform.color} text-white`}>
                        <IconComponent className="w-3 h-3 inline mr-1" />
                        {platform.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4 inline mr-2" />
              Media URL (optional)
            </label>
            <input
              id="media"
              type="url"
              value={media}
              onChange={(e) => setMedia(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Scheduling</label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="scheduleType"
                value="now"
                checked={scheduleType === 'now'}
                onChange={(e) => setScheduleType(e.target.value as 'now')}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">Post Now</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="scheduleType"
                value="later"
                checked={scheduleType === 'later'}
                onChange={(e) => setScheduleType(e.target.value as 'later')}
                className="mr-3"
              />
              <span className="text-sm text-gray-700">Schedule for Later</span>
            </label>
          </div>

          {scheduleType === 'later' && (
            <div className="ml-6">
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Select Date & Time
              </label>
              <input
                id="scheduledDate"
                type="datetime-local"
                onChange={(e) => setScheduledDate(new Date(e.target.value))}
                min={new Date().toISOString().slice(0, 16)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={scheduleType === 'later'}
              />
            </div>
          )}
        </div>

        {/* Preview */}
        {(caption || media) && selectedPlatforms.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
            <div className="bg-white rounded-lg p-4 border">
              {media && (
                <div className="mb-3">
                  <img src={media} alt="Post media" className="max-w-full h-32 object-cover rounded" />
                </div>
              )}
              <p className="text-gray-900 whitespace-pre-wrap">{caption}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!caption || selectedPlatforms.length === 0 || isOverLimit || (scheduleType === 'later' && !scheduledDate)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {scheduleType === 'now' ? 'Post Now' : 'Schedule Post'}
        </button>
      </form>
    </div>
  );
}