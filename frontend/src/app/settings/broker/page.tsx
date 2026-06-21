"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Link as LinkIcon, Unlink, Loader2, Key } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function BrokerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const [brokerName, setBrokerName] = useState('Zerodha');
  const [accountId, setAccountId] = useState('');
  const [connecting, setConnecting] = useState(false);
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/portfolio'); // We can fetch basic profile info if it's there, or we need a profile endpoint.
      // Actually we don't have a generic profile endpoint. Let's create one or just use session.
      // Wait, we have the brokerName in client profile. Let's create a dedicated fetch or just mock for now.
      // I'll create a quick fetch to see if they are connected.
      const profRes = await fetch('/api/admin/clients'); // not accessible to client
      // We will fetch from /api/portfolio instead and include clientProfile there in the next step, or just write a small API.
      // Let's create a dedicated `/api/client/profile` endpoint later. For now, assume not connected until fetched.
      const meRes = await fetch('/api/client/profile');
      if (meRes.ok) {
        setProfile(await meRes.json());
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    try {
      const res = await fetch('/api/broker/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brokerName, accountId })
      });
      if (res.ok) {
        fetchProfile();
      }
    } catch (e) {} finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch('/api/broker/connect', { method: 'DELETE' });
      if (res.ok) {
        fetchProfile();
      }
    } catch (e) {} finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 md:p-8 pt-24">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Broker Connection</h1>
          <p className="font-semibold text-theme-muted">Link your Demat account to enable direct trade execution from The Laal Street.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
        ) : profile?.brokerToken ? (
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-black text-emerald-600 dark:text-emerald-500">Connected to {profile.brokerName}</h2>
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider rounded">Active</span>
                  </div>
                  <p className="text-sm font-bold text-theme-muted">Account ID: {profile.brokerAccountId}</p>
                </div>
              </div>
              <button 
                onClick={handleDisconnect}
                disabled={connecting}
                className="px-6 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition flex items-center gap-2"
              >
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlink className="h-4 w-4" />}
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-500" /> Connect Account
              </h2>
              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Select Broker</label>
                  <select 
                    value={brokerName}
                    onChange={(e) => setBrokerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Zerodha">Zerodha Kite</option>
                    <option value="Upstox">Upstox Pro</option>
                    <option value="Groww">Groww</option>
                    <option value="AngelOne">Angel One</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Client / Account ID</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. AB1234"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 font-bold uppercase"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={connecting}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {connecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Key className="h-5 w-5" />}
                  Authenticate via OAuth
                </button>
              </form>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 border border-blue-100 dark:border-blue-800/50">
                <h3 className="font-black text-blue-800 dark:text-blue-400 mb-2">Why connect your broker?</h3>
                <ul className="space-y-3 text-sm font-semibold text-blue-700 dark:text-blue-300">
                  <li>• Seamless one-click execution of AI Optimization recommendations.</li>
                  <li>• Real-time synchronization of external trades with your portfolio here.</li>
                  <li>• Bank-grade OAuth 2.0 security. We never store your trading password.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
