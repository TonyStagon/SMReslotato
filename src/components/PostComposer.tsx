import React, { useState } from 'react';
import { Facebook, Image, Send, Eye, EyeOff } from 'lucide-react';
import { Post } from '../types';

interface PostComposerProps {
  onPostCreate: (post: Omit<Post, 'id' | 'createdAt'>, headlessMode: boolean) => void;
  isPosting: boolean;
}

export default function PostComposer({ onPostCreate, isPosting }: PostComposerProps) {
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState('');
  const [headlessMode, setHeadlessMode] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (caption.trim()) {
      onPostCreate({
        caption: caption.trim(),
        media: media || undefined,
        platforms: ['facebook'],
        status: 'draft',
      }, headlessMode);
      
      // Reset form
      setCaption('');
      setMedia('');
    }
  };

  const characterLimit = 63206; // Facebook limit
  const isOverLimit = caption.length > characterLimit;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg mr-3">
          <Facebook className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Create Facebook Post</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Post Content */}
        <div>
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="caption"
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              isOverLimit ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Share your thoughts..."
            required
            disabled={isPosting}
          />
          <p className={`text-sm mt-2 ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
            {caption.length.toLocaleString()} / {characterLimit.toLocaleString()} characters
          </p>
        </div>

        {/* Media URL */}
        <div>
          <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="w-4 h-4 inline mr-2" />
            Image URL (optional)
          </label>
          <input
            id="media"
            type="url"
            value={media}
            onChange={(e) => setMedia(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
            disabled={isPosting}
          />
        </div>

        {/* Browser Mode Selection */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Browser Automation Mode</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="browserMode"
                checked={headlessMode}
                onChange={() => setHeadlessMode(true)}
                className="mr-3 text-blue-600"
                disabled={isPosting}
              />
              <EyeOff className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">Headless (Background)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="browserMode"
                checked={!headlessMode}
                onChange={() => setHeadlessMode(false)}
                className="mr-3 text-blue-600"
                disabled={isPosting}
              />
              <Eye className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm text-gray-700">Visible Browser (Watch the automation)</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {headlessMode 
              ? 'Browser will run in the background for faster execution'
              : 'You can watch the browser automation in real-time'
            }
          </p>
        </div>

        {/* Preview */}
        {(caption || media) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
            <div className="bg-white rounded-lg p-4 border">
              {media && (
                <div className="mb-3">
                  <img 
                    src={media} 
                    alt="Post media" 
                    className="max-w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <p className="text-gray-900 whitespace-pre-wrap">{caption}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!caption.trim() || isOverLimit || isPosting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isPosting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Posting to Facebook...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Post to Facebook
            </>
          )}
        </button>
      </form>
    </div>
  );
}