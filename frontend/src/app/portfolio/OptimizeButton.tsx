"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, X, CheckCircle, ArrowRight } from 'lucide-react';

export default function OptimizeButton({ modelName }: { modelName?: string }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [executing, setExecuting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch('/api/portfolio/optimize', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setRecommendations(data.recommendations || []);
      } else {
        alert(data.error || 'Optimization failed');
        setIsOpen(false);
      }
    } catch (e) {
      alert('Optimization failed');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAll = async () => {
    setExecuting(true);
    try {
      const res = await fetch('/api/portfolio/optimize/execute', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        alert(data.error || 'Failed to execute trades');
      }
    } catch (e) {
      alert('Failed to execute trades');
    } finally {
      setExecuting(false);
    }
  };

  if (!modelName) return null;

  return (
    <>
      <button 
        onClick={handleOptimize}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
      >
        <Sparkles className="h-4 w-4" />
        Optimize Portfolio
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => !executing && setIsOpen(false)} />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black">AI Portfolio Optimization</h2>
                  <p className="text-sm font-semibold text-theme-muted">Aligning with "{modelName}" Model</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                disabled={executing}
                className="p-2 text-theme-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                <p className="font-bold text-theme-muted">Analyzing allocations & calculating rebalance trades...</p>
              </div>
            ) : success ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-2">Optimization Complete</h3>
                <p className="font-bold text-theme-muted text-center mb-6">
                  Trades have been queued to realign your portfolio with the {modelName} target allocations.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold rounded-xl transition"
                >
                  Refresh Dashboard
                </button>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="flex-1 py-12 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-black">Perfectly Aligned!</h3>
                <p className="font-bold text-theme-muted mt-2">Your portfolio matches the {modelName} targets. No rebalancing needed.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto min-h-[300px] pr-2">
                <p className="font-bold text-theme-muted mb-4">Recommended Trades ({recommendations.length}):</p>
                
                <div className="space-y-3 mb-6">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            rec.action === 'BUY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20'
                          }`}>
                            {rec.action}
                          </span>
                          <span className="font-black text-sm">{rec.symbol}</span>
                        </div>
                        <p className="text-xs font-bold text-theme-muted">{rec.reason}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-sm">{rec.quantity.toFixed(2)} Qty</div>
                        <div className="text-xs font-bold text-theme-muted">Est. ₹{rec.estimatedPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={handleExecuteAll}
                    disabled={executing}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition disabled:opacity-70"
                  >
                    {executing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                    {executing ? 'Executing Trades...' : 'Execute All Recommendations'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
