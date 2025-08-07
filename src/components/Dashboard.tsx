import React from 'react';
import { BarChart, TrendingUp, Users, MessageCircle, Eye } from 'lucide-react';
import { Post } from '../types';

interface DashboardProps {
  posts: Post[];
}

export default function Dashboard({ posts }: DashboardProps) {
  const publishedPosts = posts.filter(p => p.status === 'published');
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const failedPosts = posts.filter(p => p.status === 'failed');

  const totalReach = publishedPosts.reduce((sum, post) => sum + (post.analytics?.reach || 0), 0);
  const totalLikes = publishedPosts.reduce((sum, post) => sum + (post.analytics?.likes || 0), 0);
  const totalComments = publishedPosts.reduce((sum, post) => sum + (post.analytics?.comments || 0), 0);
  const totalImpressions = publishedPosts.reduce((sum, post) => sum + (post.analytics?.impressions || 0), 0);

  const stats = [
    { label: 'Total Reach', value: totalReach.toLocaleString(), icon: Users, change: '+12%' },
    { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: TrendingUp, change: '+8%' },
    { label: 'Comments', value: totalComments.toLocaleString(), icon: MessageCircle, change: '+15%' },
    { label: 'Impressions', value: totalImpressions.toLocaleString(), icon: Eye, change: '+5%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your social media performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BarChart className="w-4 h-4" />
          <span>Analytics Overview</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Published Posts</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{publishedPosts.length}</p>
          <p className="text-sm text-green-700 mt-1">Successfully posted</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800">Scheduled Posts</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{scheduledPosts.length}</p>
          <p className="text-sm text-blue-700 mt-1">Waiting to publish</p>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200">
          <h3 className="text-lg font-semibold text-red-800">Failed Posts</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{failedPosts.length}</p>
          <p className="text-sm text-red-700 mt-1">Need attention</p>
        </div>
      </div>
    </div>
  );
}