"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { BellRing, Plus, Trash2, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [symbol, setSymbol] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('ABOVE');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        setAlerts(await res.json());
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toUpperCase(), targetPrice, condition })
      });
      if (res.ok) {
        setSymbol('');
        setTargetPrice('');
        fetchAlerts();
      }
    } catch (e) {} finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/alerts?id=${id}`, { method: 'DELETE' });
      fetchAlerts();
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <BellRing className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Price Alerts</h1>
            <p className="text-sm font-semibold text-theme-muted">Get notified when stocks hit your target prices.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-black mb-4">Create Alert</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Symbol</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. RELIANCE"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Target Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    step="0.05"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 transition font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Condition</label>
                  <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <button 
                      type="button"
                      onClick={() => setCondition('ABOVE')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${condition === 'ABOVE' ? 'bg-emerald-500 text-white shadow-sm' : 'text-theme-muted hover:text-slate-700 dark:hover:text-theme-secondary'}`}
                    >
                      <TrendingUp className="h-3 w-3" /> Goes Above
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCondition('BELOW')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${condition === 'BELOW' ? 'bg-rose-500 text-white shadow-sm' : 'text-theme-muted hover:text-slate-700 dark:hover:text-theme-secondary'}`}
                    >
                      <TrendingDown className="h-3 w-3" /> Goes Below
                    </button>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={creating}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-70"
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Add Alert
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm min-h-[300px]">
              <h2 className="text-lg font-black mb-6">Active Alerts</h2>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-12 text-theme-muted font-bold">
                  You don't have any active price alerts.
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                      <div>
                        <div className="font-black flex items-center gap-2">
                          {alert.symbol}
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                            alert.condition === 'ABOVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                          }`}>
                            {alert.condition}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-theme-muted mt-1">
                          Target: ₹{alert.targetPrice.toLocaleString()}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(alert.id)}
                        className="p-2 rounded-lg text-theme-secondary hover:text-rose-500 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
