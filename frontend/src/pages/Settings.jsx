import React, { useState, useEffect } from 'react';
import { Bell, Shield, Monitor, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [successMsg, setSuccessMsg] = useState('');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      emailNotifs: true,
      smsNotifs: false,
      darkMode: false,
      twoFactor: false
    };
  });

  useEffect(() => {
    // Apply dark mode class to document immediately when changed
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Auto-save on toggle for better UX
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSuccessMsg('Settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
      
      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMsg}
        </div>
      )}

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        
        {/* Notifications Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gray-500" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive alerts and updates via email.</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={settings.emailNotifs} onChange={() => handleToggle('emailNotifs')} />
                  <div className={`block w-14 h-8 rounded-full ${settings.emailNotifs ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.emailNotifs ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive urgent alerts via text message.</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={settings.smsNotifs} onChange={() => handleToggle('smsNotifs')} />
                  <div className={`block w-14 h-8 rounded-full ${settings.smsNotifs ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.smsNotifs ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-gray-500" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Dark Mode</p>
              <p className="text-sm text-gray-500">Switch between light and dark themes.</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={settings.darkMode} onChange={() => handleToggle('darkMode')} />
                <div className={`block w-14 h-8 rounded-full ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.darkMode ? 'translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-gray-500" />
            Security & Privacy
          </h2>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={settings.twoFactor} onChange={() => handleToggle('twoFactor')} />
                  <div className={`block w-14 h-8 rounded-full ${settings.twoFactor ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.twoFactor ? 'translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-6 bg-gray-50 flex justify-end rounded-b-lg">
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
