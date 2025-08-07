import React, { useState } from 'react';
import { Calendar, PlusCircle, BarChart, Bot, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PostComposer from './components/PostComposer';
import PostHistory from './components/PostHistory';
import AutomationSettings from './components/AutomationSettings';
import { Post, AutomationSettings as AutomationSettingsType } from './types';
import { mockPosts } from './data/mockData';

type ActiveTab = 'dashboard' | 'create' | 'history' | 'automation';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [automationSettings, setAutomationSettings] = useState<AutomationSettingsType>({
    isEnabled: false,
    browserType: 'puppeteer',
    headlessMode: true,
    retryAttempts: 3,
  });

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart },
    { id: 'create', name: 'Create Post', icon: PlusCircle },
    { id: 'history', name: 'Post History', icon: Calendar },
    { id: 'automation', name: 'Automation', icon: Bot },
  ] as const;

  const handlePostCreate = (postData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
    setActiveTab('history');
  };

  const handlePostDelete = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostEdit = (post: Post) => {
    // In a real app, this would open the post in edit mode
    console.log('Edit post:', post);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard posts={posts} />;
      case 'create':
        return <PostComposer onPostCreate={handlePostCreate} />;
      case 'history':
        return <PostHistory posts={posts} onPostDelete={handlePostDelete} onPostEdit={handlePostEdit} />;
      case 'automation':
        return <AutomationSettings settings={automationSettings} onSettingsChange={setAutomationSettings} />;
      default:
        return <Dashboard posts={posts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Social Media Manager</h1>
                <p className="text-xs text-gray-600">AI-Powered Automation Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Social Media Automation Manager - Powered by AI & Headless Browser Technology
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>🤖 AI-Ready</span>
              <span>🌐 Multi-Platform</span>
              <span>⚡ Automated</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;