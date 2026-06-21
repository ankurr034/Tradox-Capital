"use client";

import React, { useState, useEffect } from 'react';
import LinkNext from 'next/link';
import { TrendingUp, Menu, Sparkles, Sun, Moon, User, X, ChevronDown, LineChart, Newspaper, BookOpen, Search, Activity, Briefcase, LogOut, Bell, CheckCircle2, Home, Target, FileText, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useSession, signOut } from 'next-auth/react';
import { BRAND } from '@/lib/brand';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false);
  
  // Notifications
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // poll every 15s
      return () => clearInterval(interval);
    }
  }, [session]);

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {}
  };

  const markAsRead = async (id?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { id } : { markAll: true })
      });
      fetchNotifications();
    } catch (e) {}
  };

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  React.useEffect(() => {
    if (searchQuery.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSearching(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Investment', path: '/investment' },
    { label: 'Retirement', path: '/retirement' },
    { label: 'Financial Planning', path: '/financial-planning', tag: 'NEW' },
    { label: 'Community', path: '/community' },
    { label: 'AI Analysis', path: '/ai-analysis', tag: 'AI' }
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderColor: 'var(--nav-border)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Brand Logo */}
          <LinkNext href="/" className="flex items-center gap-2 group">
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <rect width="100" height="100" rx="20" fill="#042C53" />
              <rect x="30" y="20" width="40" height="10" rx="2" fill="white" />
              <path d="M50 35 L75 65 L60 65 L60 85 L40 85 L40 65 L25 65 Z" fill="white" />
            </svg>
            <div className="flex items-baseline ml-1">
              <span className="text-xl font-black tracking-tight font-playfair" style={{ color: 'var(--text-primary)' }}>Tradox </span>
              <span className="text-xl font-black text-[#185FA5] ml-1 tracking-tight">
                Capital
              </span>
            </div>
          </LinkNext>

          {/* Main Navigation Links */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
          </div>

          {/* Search Area */}
          <div className="hidden lg:flex items-center justify-end gap-6 relative">
            
            {/* Search Bar */}
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
              </div>
              <input
                type="text"
                placeholder="Search stocks by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none font-semibold text-sm transition-all shadow-sm focus:shadow-md focus:border-blue-500"
                style={{ 
                  backgroundColor: 'var(--bg-input)', 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
              />
              
              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery.length >= 2 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden z-50 flex flex-col max-h-[400px]"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'var(--border-primary)'
                  }}
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                      <Activity className="h-5 w-5 animate-pulse mx-auto mb-2 text-blue-500" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="overflow-y-auto no-scrollbar py-2">
                      {searchResults.map((result: any) => {
                        const isPositive = result.changePercent >= 0;
                        return (
                          <LinkNext 
                            key={result.symbol} 
                            href={`/stocks/${result.exchange}:${result.symbol}`}
                            className="flex items-center justify-between px-4 py-3 hover:bg-blue-500/10 transition-colors border-b last:border-b-0"
                            style={{ borderColor: 'var(--border-primary)' }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs bg-slate-500/10" style={{ color: 'var(--text-primary)' }}>
                                {result.symbol.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{result.symbol}</div>
                                <div className="text-[10px] truncate max-w-[150px]" style={{ color: 'var(--text-muted)' }}>{result.company}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              {result.price ? (
                                <>
                                  <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>₹{result.price.toLocaleString('en-IN')}</div>
                                  <div className={`text-[10px] font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {isPositive ? '+' : ''}{result.changePercent.toFixed(2)}%
                                  </div>
                                </>
                              ) : (
                                <div className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>No live data</div>
                              )}
                            </div>
                          </LinkNext>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Portfolio Link */}
            <LinkNext 
              href="/portfolio"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
            >
              <Briefcase className="h-4 w-4 text-blue-500" />
              <span>Portfolio</span>
            </LinkNext>

            {/* Content Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setContentDropdownOpen(true)}
              onMouseLeave={() => setContentDropdownOpen(false)}
            >
              <button 
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${contentDropdownOpen ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-blue-600/90 text-white shadow-blue-500/15 hover:bg-blue-600'}`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Content</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${contentDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {contentDropdownOpen && (
                <div className="absolute top-full right-0 pt-2 w-64 z-50">
                  <div 
                    className="rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden py-2"
                    style={{ 
                      backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    <LinkNext 
                      href="/investment" 
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-500/10 transition-colors"
                    >
                      <LineChart className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Investment</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Calculate expected returns</div>
                      </div>
                    </LinkNext>
                    <LinkNext 
                      href="/retirement" 
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-500/10 transition-colors"
                    >
                      <Target className="h-5 w-5 text-emerald-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Retirement</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Plan your golden years</div>
                      </div>
                    </LinkNext>
                    <LinkNext 
                      href="/financial-planning" 
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-500/10 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-indigo-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Financial Plan</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Personalized recommendations</div>
                      </div>
                    </LinkNext>
                    <LinkNext 
                      href="/ai-analysis" 
                      className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-500/5 transition-colors group/item"
                    >
                      <div className="mt-1 p-2 bg-violet-500/10 rounded-lg group-hover/item:bg-violet-500/20 transition-colors">
                        <Sparkles className="h-5 w-5 text-violet-500 mt-0.5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Analysis</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>AI-driven market insights</div>
                      </div>
                    </LinkNext>
                    <LinkNext 
                      href="/analysis" 
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-500/10 transition-colors"
                    >
                      <Activity className="h-5 w-5 text-rose-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Indices</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Market index data & charts</div>
                      </div>
                    </LinkNext>
                    <LinkNext 
                      href="/#news" 
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-500/10 transition-colors"
                    >
                      <Newspaper className="h-5 w-5 text-sky-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>News</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Latest market updates</div>
                      </div>
                    </LinkNext>
                    <LinkNext 
                      href="/#insights" 
                      className="flex items-start gap-3 px-4 py-3 hover:bg-slate-500/10 transition-colors"
                    >
                      <BookOpen className="h-5 w-5 text-fuchsia-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Blogs</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Research & guides</div>
                      </div>
                    </LinkNext>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.6)' : 'rgba(226,232,240,0.8)',
                border: `1px solid ${theme === 'dark' ? 'rgba(51,65,85,0.5)' : 'rgba(203,213,225,0.8)'}`,
                color: theme === 'dark' ? '#fbbf24' : '#6366f1',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Auth Button */}
            {session ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2.5 rounded-xl transition-all duration-300 hover:bg-slate-500/10 relative"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                    )}
                  </button>
                  {notificationsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-80 rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden z-50 flex flex-col"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'var(--border-primary)'
                      }}>
                      <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-primary)' }}>
                        <h4 className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h4>
                        <button onClick={() => markAsRead()} className="text-[10px] font-bold text-blue-500 hover:underline">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto no-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs font-bold" style={{ color: 'var(--text-muted)' }}>No notifications</div>
                        ) : (
                          notifications.map((notif: any) => (
                            <div key={notif.id} className={`p-4 border-b last:border-0 transition-colors ${!notif.isRead ? 'bg-blue-500/5' : ''}`} style={{ borderColor: 'var(--border-primary)' }}>
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-bold text-xs" style={{ color: 'var(--text-primary)' }}>{notif.title}</h5>
                                <span className="text-[9px] font-bold" style={{ color: 'var(--text-muted)' }}>{new Date(notif.createdAt).toLocaleTimeString()}</span>
                              </div>
                              <p className="text-[11px] leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>{notif.message}</p>
                              {!notif.isRead && (
                                <button onClick={() => markAsRead(notif.id)} className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition">
                                  <CheckCircle2 className="h-3 w-3" /> Mark read
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition"
                  style={{
                    color: 'var(--text-secondary)',
                    border: `1px solid var(--border-primary)`,
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <LinkNext
                href="/login"
                className="hidden sm:flex items-center gap-2 px-6 py-2 rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-sm transition"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Login</span>
              </LinkNext>
            )}

            {/* Invest CTA */}
            <LinkNext
              href="/partner"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#10B981] hover:scale-[1.02] active:scale-[0.98] text-slate-950 font-black text-sm transition duration-300 shadow-lg shadow-emerald-500/10"
            >
              <Sparkles className="h-4 w-4" />
              <span>Invest with Us</span>
            </LinkNext>
            
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg transition"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(15,23,42,0.8)' : 'rgba(241,245,249,0.8)',
                border: `1px solid var(--border-primary)`,
                color: 'var(--text-muted)',
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 pt-16"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item, i) => {
              const isActive = pathname === item.path;
              return (
                <LinkNext
                  key={i}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold transition ${
                    isActive ? 'bg-blue-600/90 text-white' : ''
                  }`}
                  style={!isActive ? { color: 'var(--text-primary)' } : {}}
                >
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="text-[9px] px-1 rounded bg-[#10B981]/25 text-[#10B981] font-black uppercase">
                      {item.tag}
                    </span>
                  )}
                </LinkNext>
              );
            })}
            {/* Mobile Content Links */}
            <div className="mt-2 mb-1 px-4 text-[10px] font-black tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              Content & Analysis
            </div>
            <LinkNext 
              href="/analysis" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-slate-500/10"
              style={{ color: 'var(--text-primary)' }}
            >
              <LineChart className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-bold">Indices & Charts</span>
            </LinkNext>
            <LinkNext 
              href="/#news" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-slate-500/10"
              style={{ color: 'var(--text-primary)' }}
            >
              <Newspaper className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-bold">Market News</span>
            </LinkNext>
            <LinkNext 
              href="/#insights" 
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-slate-500/10"
              style={{ color: 'var(--text-primary)' }}
            >
              <BookOpen className="h-5 w-5 text-violet-500" />
              <span className="text-sm font-bold">{BRAND.shortName} Blogs</span>
            </LinkNext>

            <div className="border-t my-2" style={{ borderColor: 'var(--border-primary)' }} />
            {session ? (
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2 text-xs font-semibold text-theme-muted">
                  Logged in as <span className="text-theme-primary font-bold">{session.user?.name || session.user?.email}</span>
                </div>
                <LinkNext
                  href="/portfolio"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  <span>Portfolio</span>
                </LinkNext>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-rose-500 hover:bg-rose-500/5 transition w-full text-left"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <LinkNext
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </LinkNext>
                <LinkNext
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-slate-950 text-base font-black mt-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Create Account</span>
                </LinkNext>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
