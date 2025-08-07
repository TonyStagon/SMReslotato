import React, { useState } from 'react';
import { Bot, Settings, Globe, Shield, Zap, Server } from 'lucide-react';
import { AutomationSettings } from '../types';

interface AutomationSettingsProps {
  settings: AutomationSettings;
  onSettingsChange: (settings: AutomationSettings) => void;
}

export default function AutomationSettingsComponent({ settings, onSettingsChange }: AutomationSettingsProps) {
  const [localSettings, setLocalSettings] = useState<AutomationSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation Settings</h2>
          <p className="text-gray-600 mt-1">Configure headless browser automation and AI agents</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Bot className="w-4 h-4" />
          <span>AI Agent Control</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Browser Automation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Headless Browser Control</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable Automation</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.isEnabled}
                  onChange={(e) => setLocalSettings({ ...localSettings, isEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Browser Engine</label>
              <select
                value={localSettings.browserType}
                onChange={(e) => setLocalSettings({ ...localSettings, browserType: e.target.value as 'puppeteer' | 'playwright' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="puppeteer">Puppeteer (Chrome/Chromium)</option>
                <option value="playwright">Playwright (Multi-browser)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Headless Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.headlessMode}
                  onChange={(e) => setLocalSettings({ ...localSettings, headlessMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
              <input
                type="number"
                min="1"
                max="5"
                value={localSettings.retryAttempts}
                onChange={(e) => setLocalSettings({ ...localSettings, retryAttempts: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg mr-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-medium text-yellow-800">OAuth Integration Placeholder</h4>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                Future integration with platform OAuth APIs for secure authentication without storing credentials.
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Connect Instagram Account
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Connect Facebook Account
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Connect LinkedIn Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Advanced Automation Features</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">AI Agent Navigation</h4>
            <p className="text-sm text-gray-600 mb-3">Intelligent browser automation with human-like interactions and error recovery.</p>
            <div className="flex items-center text-xs text-purple-600">
              <Server className="w-3 h-3 mr-1" />
              Node.js + Puppeteer/Playwright
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <h4 className="font-medium text-gray-900 mb-2">Queue Management</h4>
            <p className="text-sm text-gray-600 mb-3">Robust job scheduling with retry logic and failure handling for reliable posting.</p>
            <div className="flex items-center text-xs text-purple-600">
              <Server className="w-3 h-3 mr-1" />
              Redis + Bull Queue
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
          <p className="text-sm text-gray-700">
            <strong>Pseudocode Example:</strong> <code>await loginToInstagram(credentials) → navigateToCreatePost() → uploadMedia(file) → addCaption(text) → schedulePost(date) → verifySuccess()</code>
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}