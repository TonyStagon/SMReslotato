import React, { useState } from 'react';
import { Facebook, Bot, CheckCircle, XCircle, Loader } from 'lucide-react';
import PostComposer from './components/PostComposer';
import { Post } from './types';

type PostStatus = 'idle' | 'posting' | 'success' | 'failed';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postStatus, setPostStatus] = useState<PostStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handlePostCreate = async (postData: Omit<Post, 'id' | 'createdAt'>, headlessMode: boolean) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setPostStatus('posting');
    setStatusMessage('Starting Facebook automation...');

    try {
      const response = await fetch('/api/posts/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: newPost.caption,
          media: newPost.media,
          headlessMode,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPostStatus('success');
        setStatusMessage('Post successfully published to Facebook!');
        setPosts([{ ...newPost, status: 'published' }, ...posts]);
      } else {
        setPostStatus('failed');
        setStatusMessage(result.message || 'Failed to post to Facebook');
        setPosts([{ ...newPost, status: 'failed' }, ...posts]);
      }
    } catch (error) {
      setPostStatus('failed');
      setStatusMessage('Network error occurred');
      setPosts([{ ...newPost, status: 'failed' }, ...posts]);
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setPostStatus('idle');
      setStatusMessage('');
    }, 5000);
  };

  const getStatusIcon = () => {
    switch (postStatus) {
      case 'posting':
        return <Loader className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg mr-3">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Facebook Auto Poster</h1>
                <p className="text-xs text-gray-600">Automated Browser Posting</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Bot className="w-4 h-4" />
              <span>Puppeteer/Playwright Ready</span>
            </div>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      {postStatus !== 'idle' && (
        <div className={`border-b ${
          postStatus === 'posting' ? 'bg-blue-50 border-blue-200' :
          postStatus === 'success' ? 'bg-green-50 border-green-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              {getStatusIcon()}
              <span className={`ml-3 text-sm font-medium ${
                postStatus === 'posting' ? 'text-blue-800' :
                postStatus === 'success' ? 'text-green-800' :
                'text-red-800'
              }`}>
                {statusMessage}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Post Composer */}
          <PostComposer onPostCreate={handlePostCreate} isPosting={postStatus === 'posting'} />

          {/* Recent Posts */}
          {posts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {post.status === 'published' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{post.caption}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.createdAt.toLocaleString()} • 
                        <span className={`ml-1 ${post.status === 'published' ? 'text-green-600' : 'text-red-600'}`}>
                          {post.status === 'published' ? 'Published' : 'Failed'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;