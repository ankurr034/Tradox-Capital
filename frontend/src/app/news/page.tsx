"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Filter, Clock, Search, RefreshCw, ExternalLink, Activity } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function NewsDashboardPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market-news');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          // Format data to match our UI
          const formatted = json.data.map((item: any, i: number) => {
            const categories = ['Markets', 'Economy', 'Personal Finance', 'Tech'];
            return {
              id: `news-${i}-${Date.now()}`,
              title: item.title,
              summary: item.description,
              link: item.link,
              imageUrl: item.image || null,
              source: item.source || 'LiveMint',
              timeAgo: item.pubDate ? new Date(item.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now',
              displayCategory: categories[i % categories.length]
            };
          });
          setArticles(formatted);
          setLastRefreshed(new Date());
        }
      }
    } catch (e) {
      console.error("Failed to fetch news:", e);
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All Sources');

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchNews();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = selectedSource === 'All Sources' || article.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary font-sans transition-colors duration-300">
      <Navbar />
      
      {/* Top Filter Bar */}
      <div className="border-b border-theme bg-theme-primary sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-muted" />
            <input 
              type="text" 
              placeholder="Search live market news..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm font-semibold border border-theme rounded-xl bg-theme-surface focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="text-sm font-semibold border border-theme rounded-xl px-3 py-2.5 bg-theme-surface focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="All Sources">All Sources</option>
              <option value="LiveMint">LiveMint</option>
              <option value="Economic Times">Economic Times</option>
              <option value="Moneycontrol">Moneycontrol</option>
              <option value="Business Standard">Business Standard</option>
              <option value="NDTV Profit">NDTV Profit</option>
            </select>
            
            <button 
              onClick={fetchNews}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-2.5 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-theme pb-4 mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-theme-primary tracking-tight">Live Market News</h2>
            <p className="text-theme-muted font-medium mt-1">Real-time updates from Indian markets and economy</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-lg text-xs font-black tracking-wider uppercase border border-emerald-100 dark:border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Feed
            </span>
            {lastRefreshed && (
              <div className="text-[11px] font-bold text-theme-faint mt-2">
                Updated {lastRefreshed.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-5">
          {loading && articles.length === 0 ? (
            <div className="bg-theme-card rounded-2xl p-16 flex flex-col items-center justify-center text-center border border-theme shadow-sm">
              <Activity className="h-8 w-8 text-blue-500 animate-bounce mb-4" />
              <p className="font-bold text-theme-primary text-lg">Fetching live market updates...</p>
              <p className="text-theme-muted font-medium mt-1 text-sm">Please wait while we gather the latest news.</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-theme-card rounded-2xl p-12 text-center border border-theme shadow-sm">
              <p className="font-medium text-theme-muted">No news articles found.</p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <a key={article.id} href={article.link} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="bg-theme-card border border-theme rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 hover:border-blue-500/30">
                  
                  {/* Image */}
                  <div className="w-full md:w-64 h-40 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden relative border border-theme">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                        <Newspaper className="h-10 w-10 mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Tradox News</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-1 pr-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-theme-primary group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-theme-muted line-clamp-2 leading-relaxed font-medium">
                          {article.summary}
                        </p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 mt-1 border border-theme group-hover:border-blue-200 dark:group-hover:border-blue-500/30 group-hover:-translate-y-0.5">
                        <ExternalLink className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-3 mt-5 text-xs font-bold">
                      <span className="px-3 py-1.5 rounded-lg bg-[#fdf3e7] text-[#e47600] border border-[#fbe4cc] dark:bg-[#e47600]/10 dark:border-[#e47600]/20 shadow-sm">
                        {article.source}
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme text-theme-secondary shadow-sm">
                        {article.displayCategory}
                      </span>
                      <span className="flex items-center gap-1.5 text-theme-muted ml-auto">
                        <Clock className="h-3.5 w-3.5" /> Published at {article.timeAgo}
                      </span>
                    </div>
                  </div>

                </div>
              </a>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
