"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import Link from 'next/link';

// Core Nifty 50 stocks for heatmap & movers
const CORE_STOCKS = [
  'RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'INFY', 
  'ITC', 'SBIN', 'BHARTIARTL', 'BAJFINANCE', 'HINDUNILVR',
  'L&T', 'KOTAKBANK', 'AXISBANK', 'HCLTECH', 'ASIANPAINT',
  'TITAN', 'MARUTI', 'SUNPHARMA', 'TATASTEEL', 'ULTRACEMCO'
];

export default function MarketOverview() {
  const [liveData, setLiveData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active'>('gainers');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/batch-quotes?symbols=${CORE_STOCKS.join(',')}`);
        if (res.ok && isSubscribed) {
          const data = await res.json();
          setLiveData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, []);

  const dataArray = Object.entries(liveData).map(([sym, data]) => ({ symbol: sym, ...data }));
  
  const topGainers = [...dataArray].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...dataArray].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...dataArray].sort((a, b) => b.volume - a.volume).slice(0, 5);

  const activeList = activeTab === 'gainers' ? topGainers : activeTab === 'losers' ? topLosers : mostActive;

  return (
    <div className="py-12 bg-opacity-30 border-t border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Market Overview</h2>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Real-time updates for top Indian equities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Heatmap Section */}
          <div className="lg:col-span-2 rounded-3xl p-6 border shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Activity className="h-5 w-5 text-blue-500" />
                Market Heatmap
              </h3>
              <Link href="/analysis" className="text-sm font-bold text-blue-500 hover:underline">View All &rarr;</Link>
            </div>
            
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Activity className="h-8 w-8 animate-pulse text-blue-500" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dataArray.slice(0, 12).map((stock) => {
                  const isPositive = stock.changePercent >= 0;
                  // Dynamic opacity based on magnitude
                  const magnitude = Math.min(Math.abs(stock.changePercent) / 3, 1);
                  const bgOpacity = 0.1 + (magnitude * 0.9);
                  
                  return (
                    <Link 
                      href={`/stocks/NSE:${stock.symbol}`}
                      key={stock.symbol}
                      className="p-4 rounded-2xl flex flex-col items-center justify-center transition-transform hover:scale-105"
                      style={{ 
                        backgroundColor: isPositive ? `rgba(16, 185, 129, ${bgOpacity})` : `rgba(244, 63, 94, ${bgOpacity})`,
                        border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                      }}
                    >
                      <span className="font-black text-sm mb-1" style={{ color: isPositive ? '#064e3b' : '#881337' }}>
                        {stock.symbol}
                      </span>
                      <span className="font-bold text-xs" style={{ color: isPositive ? '#065f46' : '#9f1239' }}>
                        {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top Movers Section */}
          <div className="rounded-3xl p-6 border shadow-lg flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Top Movers
            </h3>

            <div className="flex rounded-xl p-1 mb-6" style={{ backgroundColor: 'var(--bg-input)' }}>
              <button 
                onClick={() => setActiveTab('gainers')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'gainers' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Gainers
              </button>
              <button 
                onClick={() => setActiveTab('losers')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'losers' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Losers
              </button>
              <button 
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${activeTab === 'active' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
              >
                Active
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Activity className="h-6 w-6 animate-pulse text-blue-500" />
                </div>
              ) : activeList.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <Link 
                    href={`/stocks/NSE:${stock.symbol}`}
                    key={stock.symbol}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-500/5 transition-colors border"
                    style={{ borderColor: 'var(--border-primary)' }}
                  >
                    <div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</div>
                      <div className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {activeTab === 'active' ? `Vol: ${(stock.volume/100000).toFixed(1)}L` : `₹${stock.price.toLocaleString('en-IN')}`}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 font-black text-xs ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
