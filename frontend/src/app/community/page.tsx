"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Users, TrendingUp, Star, Award, ChevronRight, Copy } from 'lucide-react';

export default function CommunityPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        setLeaderboard(await res.json());
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  const handleCopyTrade = (id: string) => {
    alert(`Copy trading initiated for Portfolio ID: ${id}. Ensure your broker is connected in Settings.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-12">
      <Navbar />
      
      <div className="pt-24 max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              Social Trading <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            </h1>
            <p className="font-semibold text-theme-muted">Discover top performers, track their strategies, and copy their success.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
              My Followers
            </button>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center gap-2">
              <Users className="h-4 w-4" /> Make Profile Public
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="font-black text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-500" /> Top Traders
              </h2>
              <select className="bg-slate-50 dark:bg-slate-800 border-none outline-none font-bold text-sm px-3 py-1.5 rounded-lg">
                <option>All Time</option>
                <option>This Month</option>
                <option>This Week</option>
              </select>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800"></div>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-theme-muted font-bold shadow-sm">
                No public portfolios available yet.
              </div>
            ) : (
              leaderboard.map((trader, idx) => (
                <div key={trader.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  
                  {idx < 3 && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400 to-amber-600 rounded-bl-full flex items-start justify-end p-3 z-10">
                      <span className="text-white font-black text-lg">#{idx + 1}</span>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-20">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
                        {trader.traderName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-black">{trader.traderName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-theme-muted flex items-center gap-1">
                            <Users className="h-3 w-3" /> {trader.followersCount} Followers
                          </span>
                          <span className="text-xs font-bold text-theme-muted flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500" /> Top Asset: {trader.topHolding}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-wider text-theme-muted mb-1">Return</div>
                        <div className={`text-2xl font-black flex items-center gap-1 ${trader.returnPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {trader.returnPercent >= 0 ? <TrendingUp className="h-5 w-5" /> : null}
                          {trader.returnPercent > 0 ? '+' : ''}{trader.returnPercent.toFixed(2)}%
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleCopyTrade(trader.id)}
                        className="h-12 w-12 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-theme-secondary hover:text-indigo-600 rounded-xl flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 group-hover:scale-105"
                        title="Copy Trade"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20">
              <h3 className="font-black text-xl mb-2">Become a Leader</h3>
              <p className="text-sm font-medium text-blue-100 mb-6">
                Make your portfolio public to allow others to track your success. Earn badges and build your reputation.
              </p>
              <button className="w-full py-3 bg-white text-blue-600 font-black rounded-xl hover:bg-blue-50 transition shadow-md">
                Learn More
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-black mb-4">Trending Assets</h3>
              <div className="space-y-4">
                {['RELIANCE', 'TCS', 'HDFCBANK'].map((sym, i) => (
                  <div key={sym} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="font-black text-sm">{sym}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-theme-secondary group-hover:text-blue-500 transition" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
