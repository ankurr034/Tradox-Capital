"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Shield, Bell, Key, Database, Globe, Save, Loader2, CheckCircle2 } from 'lucide-react';

const TABS = [
  { id: 'general', icon: Globe, label: 'General Configuration' },
  { id: 'security', icon: Shield, label: 'Security & Auth' },
  { id: 'database', icon: Database, label: 'Database & Backups' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'api_keys', icon: Key, label: 'API Keys' },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const [formData, setFormData] = useState({
    PLATFORM_NAME: 'Tradox Capital PMS',
    SUPPORT_EMAIL: 'support@tradoxcapital.com',
    DEFAULT_CURRENCY: 'INR',
    // Security
    MFA_ENABLED: 'false',
    SESSION_TIMEOUT: '30',
    // Database
    AUTO_BACKUP: 'true',
    BACKUP_FREQUENCY: 'daily',
    // Notifications
    EMAIL_NOTIFICATIONS: 'true',
    SMS_NOTIFICATIONS: 'false',
    // API
    STRIPE_KEY: '',
    MARKET_DATA_KEY: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setToast({ msg: 'Settings saved successfully!', type: 'success' });
      } else {
        setToast({ msg: 'Failed to save settings.', type: 'error' });
      }
    } catch (err) {
      setToast({ msg: 'An error occurred.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">System Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {TABS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-theme-secondary hover:border-blue-500/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black mb-6">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            
            <div className="space-y-6">
              
              {activeTab === 'general' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Platform Name</label>
                    <input 
                      type="text" 
                      value={formData.PLATFORM_NAME}
                      onChange={(e) => setFormData({...formData, PLATFORM_NAME: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Support Email</label>
                    <input 
                      type="email" 
                      value={formData.SUPPORT_EMAIL}
                      onChange={(e) => setFormData({...formData, SUPPORT_EMAIL: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Default Currency</label>
                    <select 
                      value={formData.DEFAULT_CURRENCY}
                      onChange={(e) => setFormData({...formData, DEFAULT_CURRENCY: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold appearance-none"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Require Multi-Factor Authentication</label>
                    <select 
                      value={formData.MFA_ENABLED}
                      onChange={(e) => setFormData({...formData, MFA_ENABLED: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold appearance-none"
                    >
                      <option value="true">Enabled (Required for all users)</option>
                      <option value="false">Disabled (Optional)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Session Timeout (Minutes)</label>
                    <input 
                      type="number" 
                      value={formData.SESSION_TIMEOUT}
                      onChange={(e) => setFormData({...formData, SESSION_TIMEOUT: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold"
                    />
                  </div>
                </>
              )}

              {activeTab === 'database' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Automated Backups</label>
                    <select 
                      value={formData.AUTO_BACKUP}
                      onChange={(e) => setFormData({...formData, AUTO_BACKUP: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold appearance-none"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Backup Frequency</label>
                    <select 
                      value={formData.BACKUP_FREQUENCY}
                      onChange={(e) => setFormData({...formData, BACKUP_FREQUENCY: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold appearance-none"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">System Email Notifications</label>
                    <select 
                      value={formData.EMAIL_NOTIFICATIONS}
                      onChange={(e) => setFormData({...formData, EMAIL_NOTIFICATIONS: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold appearance-none"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">System SMS Notifications</label>
                    <select 
                      value={formData.SMS_NOTIFICATIONS}
                      onChange={(e) => setFormData({...formData, SMS_NOTIFICATIONS: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold appearance-none"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'api_keys' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Stripe Payment Key</label>
                    <input 
                      type="password" 
                      value={formData.STRIPE_KEY}
                      onChange={(e) => setFormData({...formData, STRIPE_KEY: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold font-mono"
                      placeholder="sk_live_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-theme-muted dark:text-theme-secondary mb-2">Market Data API Key (AlphaVantage/Yahoo)</label>
                    <input 
                      type="password" 
                      value={formData.MARKET_DATA_KEY}
                      onChange={(e) => setFormData({...formData, MARKET_DATA_KEY: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors font-bold font-mono"
                      placeholder="Enter API Key"
                    />
                  </div>
                </>
              )}

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button 
                  onClick={fetchSettings}
                  className="px-6 py-3 rounded-xl font-bold text-theme-muted dark:text-theme-secondary hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition disabled:opacity-70"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800/50 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/50 dark:border-rose-800/50 dark:text-rose-400'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : null}
          <span className="text-sm font-bold">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
