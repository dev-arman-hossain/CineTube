'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Bell, Shield, Moon, Monitor, Trash2 } from 'lucide-react';
import { AdminAppService } from '@/services/adminService';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    siteName: 'Cinetube Admin',
    supportEmail: 'support@cinetube.com',
    maintenanceMode: false,
    emailNotifications: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await AdminAppService.getSettings();
        if (response.success) {
          setFormData(response.data);
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await AdminAppService.updateSettings(formData);
      if (response.success) {
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setIsClearing(true);
      await AdminAppService.clearCache();
      toast.success('System cache cleared successfully!');
    } catch (error) {
      toast.error('Failed to clear cache. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tighter flex items-center gap-4">
            <Settings className="w-10 h-10 text-primary animate-spin-slow" />
            Platform <span className="text-primary">Settings</span>
          </h1>
          <p className="text-secondary-foreground text-lg mt-3 max-w-xl leading-relaxed">
            Manage global configurations, visual preferences, and security protocols for the entire Cinetube ecosystem.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-primary !text-white font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>
              Saving...
            </span>
          ) : (
            <>
              <Save className="w-5 h-5 fill-current" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Settings Sidebar Content */}
        <div className="md:col-span-3 space-y-2">
          {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                 activeTab === tab.id 
                   ? 'bg-primary !text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] border border-primary' 
                   : 'text-secondary-foreground hover:bg-white/5 border border-transparent'
               }`}
             >
               <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white fill-white/20' : 'text-neutral-400'}`} />
               {tab.label}
             </button>
          ))}
        </div>

        {/* Settings Form Content */}
        <div className="md:col-span-9">
          {isLoading ? (
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 animate-pulse space-y-8">
              <div className="h-8 bg-white/5 rounded-lg w-1/3"></div>
              <div className="space-y-4">
                <div className="h-12 bg-white/5 rounded-xl w-full"></div>
                <div className="h-12 bg-white/5 rounded-xl w-full"></div>
              </div>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-8"
            >
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-1">General Info</h3>
                    <p className="text-sm text-neutral-400 mb-6">Basic platform details and contact information.</p>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-neutral-300 mb-2">Platform Name</label>
                        <input 
                          type="text" 
                          value={formData.siteName}
                          onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-300 mb-2">Support Email Address</label>
                        <input 
                          type="email" 
                          value={formData.supportEmail}
                          onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  <div>
                    <h3 className="text-xl font-bold mb-1">Maintenance Mode</h3>
                    <p className="text-sm text-neutral-400 mb-6">Take the application offline for updates.</p>
                    
                    <label className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <div>
                        <p className="font-bold text-white">Enable Maintenance</p>
                        <p className="text-xs text-neutral-500 mt-1">Users will see a "Down for maintenance" screen.</p>
                      </div>
                      <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${formData.maintenanceMode ? 'bg-primary' : 'bg-neutral-800'}`} onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}>
                        <motion.div 
                          className="w-6 h-6 bg-white rounded-full"
                          animate={{ x: formData.maintenanceMode ? 24 : 0 }}
                        />
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold mb-1">Email Configurations</h3>
                  <p className="text-sm text-neutral-400 mb-6">Manage how the system communicates with admins and users.</p>
                  
                  <label className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-bold text-white">System Alerts</p>
                      <p className="text-xs text-neutral-500 mt-1">Receive emails for new user signups and payment failures.</p>
                    </div>
                    <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${formData.emailNotifications ? 'bg-primary' : 'bg-neutral-800'}`} onClick={() => setFormData({...formData, emailNotifications: !formData.emailNotifications})}>
                      <motion.div 
                        className="w-6 h-6 bg-white rounded-full"
                        animate={{ x: formData.emailNotifications ? 24 : 0 }}
                      />
                    </div>
                  </label>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8 text-center py-10">
                  <Monitor className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Theme Configuration</h3>
                  <p className="text-neutral-400 max-w-sm mx-auto">Admin theme configuration is coming soon. The platform currently exclusively supports Dark Mode for a cinematic experience.</p>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-red-500 flex items-center gap-2">
                      <Trash2 className="w-5 h-5" /> Danger Zone
                    </h3>
                    <p className="text-sm text-neutral-400 mb-6">Irreversible actions that affect the entire application state.</p>
                    
                    <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                         <div>
                           <p className="font-bold text-white">Clear All Cache</p>
                           <p className="text-xs text-neutral-400 mt-1">Forces all users to re-fetch images and assets.</p>
                         </div>
                         <button 
                           onClick={handleClearCache}
                           disabled={isClearing}
                           className="px-5 py-2.5 bg-neutral-900 border border-white/10 hover:bg-red-500 hover:text-white transition-colors rounded-xl text-sm font-bold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           {isClearing ? 'Clearing...' : 'Clear Cache'}
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
