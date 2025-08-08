import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Edit, Trash2, Eye, Instagram, Facebook, Twitter, Linkedin, Music } from 'lucide-react';
import { Post } from '../types';
import { socialPlatforms } from '../data/mockData';

interface PostHistoryProps {
  posts: Post[];
  onPostDelete: (postId: string) => void;
  onPostEdit: (post: Post) => void;
}

export default function PostHistory({ posts, onPostDelete, onPostEdit }: PostHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'published' | 'failed'>('all');

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

  const filteredPosts = posts.filter(post => filter === 'all' || post.status === filter);

  const getStatusIcon = (status: Post['status']) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'scheduled':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: Post['status']) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'scheduled':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Post History</h2>
          <p className="text-gray-600 mt-1">Manage your scheduled and published posts</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {(['all', 'scheduled', 'published', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs">
                  {posts.filter(p => p.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No posts found for the selected filter.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(post.status)}
                    <span className={getStatusBadge(post.status)}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.createdAt.toLocaleDateString()}
                    </span>
                    {post.scheduledDate && (
                      <span className="text-sm text-blue-600 font-medium">
                        Scheduled: {post.scheduledDate.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-900 mb-4 line-clamp-3">{post.caption}</p>

                  {/* Platforms */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm text-gray-600">Platforms:</span>
                    {post.platforms.map(platformId => {
                      const platform = socialPlatforms.find(p => p.id === platformId);
                      const IconComponent = platform ? getIconComponent(platform.icon) : Instagram;
                      return platform ? (
                        <span
                          key={platformId}
                          className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${platform.color} text-white`}
                        >
                          <IconComponent className="w-3 h-3 inline mr-1" />
                          {platform.name}
                        </span>
                      ) : null;
                    })}
                  </div>

                  {/* Analytics */}
                  {post.status === 'published' && post.analytics && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{post.analytics.reach.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Reach</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{post.analytics.likes.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Likes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{post.analytics.comments.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Comments</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{post.analytics.impressions.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">Impressions</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Media Preview */}
                {post.media && (
                  <div className="ml-6">
                    <img
                      src={post.media}
                      alt="Post media"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onPostEdit(post)}
                    className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onPostDelete(post.id)}
                    className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                  {post.status === 'published' && (
                    <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      View Live
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}