"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { BRAND } from '@/lib/brand';
import MarketOverview from '@/components/MarketOverview';
import { 
  Shield, 
  Sparkles, 
  TrendingUp, 
  Cpu, 
  PieChart, 
  BadgeDollarSign, 
  ChevronRight, 
  Sliders, 
  Layers, 
  Lock, 
  Building, 
  Check, 
  ChevronDown, 
  HelpCircle, 
  Activity, 
  Globe, 
  LineChart, 
  BookOpen, 
  Briefcase, 
  Users,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  Newspaper,
  ExternalLink,
  Clock
} from 'lucide-react';

export default function Home() {
  const { theme } = useTheme();
  // 1. Live Market Ticker Data — fetched from backend
  const [tickerData, setTickerData] = useState<Array<{name: string; price: string; change: string; pct: string; isUp: boolean; marketState?: string}>>([]);
  const [tickerLoading, setTickerLoading] = useState(true);
  const [tickerError, setTickerError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Fallback mock data used only when the backend is unreachable
  const FALLBACK_TICKER = [
    { name: "NIFTY 50", price: "23,456.80", change: "+145.20", pct: "+0.62%", isUp: true },
    { name: "SENSEX", price: "77,180.15", change: "+412.30", pct: "+0.54%", isUp: true },
    { name: "Nifty Bank", price: "49,320.10", change: "+380.45", pct: "+0.78%", isUp: true },
    { name: "USD / INR", price: "83.42", change: "-0.08", pct: "-0.10%", isUp: false },
    { name: "Reliance", price: "2,845.50", change: "+32.10", pct: "+1.14%", isUp: true },
    { name: "TCS", price: "3,910.15", change: "-18.40", pct: "-0.47%", isUp: false },
  ];

  const fetchLiveTicker = async () => {
    try {
      const res = await fetch('/api/market-ticker');
      if (!res.ok) throw new Error('Backend returned error');
      const json = await res.json();

      if (json.success && json.data && json.data.length > 0) {
        const formatted = json.data.map((t: { name: string; price: number; change: number; pct: number; isUp: boolean; currency?: string; marketState?: string }) => {
          const isINR = t.currency === 'INR' || !['USD'].includes(t.currency || '');
          return {
            name: t.name,
            price: t.price.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
            change: `${t.isUp ? '+' : ''}${t.change.toFixed(2)}`,
            pct: `${t.isUp ? '+' : ''}${t.pct.toFixed(2)}%`,
            isUp: t.isUp,
            marketState: t.marketState,
            currency: isINR ? '₹' : '$',
          };
        });
        setTickerData(formatted);
        setTickerError(false);
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch {
      // If backend is down, show fallback data once
      if (tickerData.length === 0) {
        setTickerData(FALLBACK_TICKER);
        setTickerError(true);
      }
    } finally {
      setTickerLoading(false);
    }
  };

  // Fetch on mount, then refresh every 15 seconds
  useEffect(() => {
    fetchLiveTicker();
    const interval = setInterval(fetchLiveTicker, 15_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Capabilities Showcase Tab State
  const [activeCapTab, setActiveCapTab] = useState('quant'); // 'mutual', 'quant', 'alts', 'retirement'

  // 3. SIP & Portfolio Allocator State
  const [sipAmount, setSipAmount] = useState(25000);
  const [riskProfile, setRiskProfile] = useState('growth'); // 'defensive', 'balanced', 'growth', 'speculative'
  const [durationYears, setDurationYears] = useState(10);

  // Computations for SIP Calculator
  const getRiskDetails = () => {
    switch (riskProfile) {
      case 'defensive':
        return {
          cagr: 8.5,
          label: "Conservative Yield",
          allocation: [
            { asset: "High-Grade Sovereign Debt", pct: 60, color: "bg-blue-500" },
            { asset: "Large-Cap Equities", pct: 25, color: "bg-emerald-500" },
            { asset: "Sovereign Gold / Alternatives", pct: 15, color: "bg-amber-500" }
          ],
          description: "Prioritizes capital preservation and steady compounding through premier sovereign debt and blue-chip equities."
        };
      case 'balanced':
        return {
          cagr: 11.8,
          label: "Balanced Growth",
          allocation: [
            { asset: "Large & Mid-Cap Equities", pct: 50, color: "bg-emerald-500" },
            { asset: "Corporate Credit & Bonds", pct: 35, color: "bg-blue-500" },
            { asset: "Gold & Hedge Alternates", pct: 15, color: "bg-amber-500" }
          ],
          description: "A harmonic balance between stable debt instruments and high-performing equity assets for steady inflation-beating wealth accumulation."
        };
      case 'growth':
        default:
          return {
            cagr: 15.2,
            label: "Strategic AI-Growth",
            allocation: [
              { asset: "Mid & Small-Cap Alpha Equities", pct: 65, color: "bg-emerald-500" },
              { asset: "Tradox Capital AI Quant Core", pct: 20, color: "bg-violet-500" },
              { asset: "Alternative Debt / Private Markets", pct: 15, color: "bg-blue-500" }
            ],
            description: "Aggressive wealth compounding powered by data-driven equity selections and our flagship quantitative predictive strategies."
          };
      case 'speculative':
        return {
          cagr: 19.8,
          label: "Hyper-Alpha Quantitative",
          allocation: [
            { asset: "Tradox Capital AI Quant High-Conviction", pct: 60, color: "bg-violet-500" },
            { asset: "Emerging Tech & Infrastructure Equity", pct: 30, color: "bg-emerald-500" },
            { asset: "Private Venture Credit", pct: 10, color: "bg-pink-500" }
          ],
          description: "Maximized exposure to short-to-medium-term algorithmic equity predictions, optimized weekly using artificial intelligence systems."
        };
    }
  };

  const riskDetails = getRiskDetails();
  
  // SIP Compound Interest Calculations
  const calculateSIP = () => {
    const monthlyRate = (riskDetails.cagr / 100) / 12;
    const months = durationYears * 12;
    const totalInvested = sipAmount * months;
    
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const futureValue = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const estimatedReturns = futureValue - totalInvested;
    
    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(futureValue),
      estimatedReturns: Math.round(estimatedReturns)
    };
  };

  const { totalInvested, futureValue, estimatedReturns } = calculateSIP();

  // 4. Tradox (Tradox Capital Investment Institute) Insights Filter State
  const [activeInsightTab, setActiveInsightTab] = useState('all'); // 'all', 'macro', 'geopolitical', 'tech'

  const insightsData = [
    {
      id: 1,
      category: "macro",
      categoryLabel: "Macro Strategy",
      title: "Navigating Interest Rate Plateaus: The Shift to Active Credit",
      summary: "As central banks transition away from hyper-tightening cycles, static fixed income fails. We examine structural credit opportunities yielding 12-14% CAGR in emerging markets.",
      readTime: "7 Min Read",
      date: "May 28, 2026",
      author: "Dr. Ramesh Nair, Principal Macro Strategist",
      imageGrad: "from-blue-600/20 to-indigo-900/40"
    },
    {
      id: 2,
      category: "tech",
      categoryLabel: "Technology & AI",
      title: "Generative Algorithmic Portfolios: The Epoch of Machine Alpha",
      summary: "Traditional quantitative tools rely on historic stationary patterns. Modern deep reinforcement learning models adapt to volatile regimes in real-time, yielding substantial returns.",
      readTime: "9 Min Read",
      date: "May 25, 2026",
      author: "Priya Sharma, Lead AI Engineer",
      imageGrad: "from-violet-600/20 to-purple-900/40"
    },
    {
      id: 3,
      category: "geopolitical",
      categoryLabel: "Geopolitical Outlook",
      title: "Reshoring Capital: India's Manufacturing Renaissance",
      summary: "Multinational supply-chain fragmentation represents a generation-defining relocation of global capital. We outline target sectors poised for institutional inflows.",
      readTime: "6 Min Read",
      date: "May 20, 2026",
      author: "Marcus Vance, Director of Global Research",
      imageGrad: "from-emerald-600/20 to-teal-900/40"
    },
    {
      id: 4,
      category: "macro",
      categoryLabel: "Macro Strategy",
      title: "The Demographic Advantage: Capitalizing on India's Wealth Expansion",
      summary: "An in-depth analysis of structural consumer credit, asset management penetration, and the unprecedented intergenerational wealth transition occurring over the next decade.",
      readTime: "8 Min Read",
      date: "May 15, 2026",
      author: "Ananya Roy, Senior Economist",
      imageGrad: "from-pink-600/20 to-rose-900/40"
    }
  ];

  const filteredInsights = activeInsightTab === 'all' 
    ? insightsData 
    : insightsData.filter(item => item.category === activeInsightTab);

  // 4b. Live Market News from LiveMint
  const [liveNews, setLiveNews] = useState<Array<{title: string; link: string; description: string; pubDate: string; image: string; source: string}>>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/market-news');
        if (!res.ok) throw new Error('News fetch failed');
        const json = await res.json();
        if (json.success && json.data) {
          setLiveNews(json.data);
        }
      } catch {
        // silently fail — news section just won't show
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 120_000); // refresh every 2 min
    return () => clearInterval(interval);
  }, []);

  // 5. Kautilya Risk Engine Stress-Tester State
  const [stressScenario, setStressScenario] = useState('stagflation'); // 'stagflation', 'ai_leap', 'trade_war'

  const getStressMetrics = () => {
    switch (stressScenario) {
      case 'stagflation':
        return {
          scenarioName: "Stagflationary Energy Shock",
          description: "Global energy supply constriction drives crude oil past $120/barrel, triggering stubborn domestic inflation. Interest rates spike and traditional active mutual funds undergo broad drawdowns.",
          kautilyaImpact: "-4.2%",
          niftyImpact: "-18.5%",
          resilienceGrade: "A+",
          actionTaken: "Automatically reallocates 22% of capital to Sovereign Gold and multi-factor energy hedging credit baskets.",
          chartPoints: [80, 75, 76, 73, 76, 78] // Kautilya outperforms
        };
      case 'ai_leap':
        return {
          scenarioName: "AI Infrastructure Breakout",
          description: "Mass commercialization of next-gen generative agent architectures causes hyper-productivity gains. Technology and semiconductor infrastructure sectors grow exponentially, leaving low-tech legacy stocks stagnant.",
          kautilyaImpact: "+34.5%",
          niftyImpact: "+12.1%",
          resilienceGrade: "A",
          actionTaken: "Channels quantitative overweight into automated GPU-datacenter REITs and high-conviction tech hardware equities.",
          chartPoints: [80, 85, 95, 110, 125, 142]
        };
      case 'trade_war':
        default:
          return {
            scenarioName: "Sovereign Trade Decoupling",
            description: "Severe trade tariff standoffs between global blocks cause a supply chain halt in semiconductor imports. Import costs surge by 40%, placing substantial pressure on heavy manufacturing indices.",
            kautilyaImpact: "-6.8%",
            niftyImpact: "-22.4%",
            resilienceGrade: "B+",
            actionTaken: "Liquidity engine triggers short positions on vulnerable consumer exporters while scaling long exposure on local domestic materials.",
            chartPoints: [80, 72, 70, 68, 71, 74]
          };
    }
  };

  const stressMetrics = getStressMetrics();

  // 6. Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 7. News Expand State
  const [showAllNews, setShowAllNews] = useState(false);

  const faqData = [
    {
      q: "How does the AI Stock Forecasting engine make decisions?",
      a: "Our proprietary quantitative model combines deep learning transformers, natural language processing (analyzing global financial news, regulatory filings, and market sentiment), and multi-factor fundamental analysis. It updates predictions weekly, scanning thousands of public equities to construct high-conviction baskets targeted at beating the benchmark index."
    },
    {
      q: "What is the Kautilya Risk Engine and how does it safeguard my capital?",
      a: "Inspired by global systems like BlackRock's Aladdin, Kautilya is our central investment risk technology platform. It constantly stress-tests all portfolios against thousands of historical and forward-looking macroeconomic risk scenarios (e.g., energy spikes, sudden regulatory hikes, systemic trade blockades), actively suggesting risk adjustments or performing automatic fiduciary rebalancing to shield assets from extreme downturns."
    },
    {
      q: "Are the investment recommendations and calculators SEBI compliant?",
      a: "Yes. All mutual fund allocations, portfolio advice, and transactional structures are managed in alignment with SEBI (Securities and Exchange Board of India) guidelines. We operate under strict fiduciary standards, meaning your financial stability and transparency always represent our primary mandate."
    },
    {
      q: "Is there a minimum investment capital required to start?",
      a: "While our advanced quantitative models and alternative private market debt allocations are tailored for premium portfolios (recommended starting capital of ₹5,00,000), our standard SIP Portfolio Optimizer and mutual fund baskets are fully accessible starting at ₹5,000 per month."
    },
    {
      q: "How secure is my personal and transactional data?",
      a: "We maintain institutional-grade security. All calculations, data caching, and user analytical inputs are encrypted using AES 256-bit standards. Furthermore, our planning modules run secure client-side computing where possible, keeping your financial metrics confidential and local."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* Sticky Hero Section Wrapper */}
      <div className="sticky top-0 w-full min-h-screen flex flex-col justify-center z-0 overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Ambient Glowing Orbs */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-violet-600/5 rounded-full blur-[180px] pointer-events-none" />
          </>
        )}
        
        <section className="relative flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto flex z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center w-full relative z-10">
            
            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>{BRAND.name.toUpperCase()} INVESTMENT PLATFORM</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] font-playfair" style={{ color: 'var(--text-primary)' }}>
                Institutional-Grade <br />
                <span className="bg-gradient-to-r from-emerald-400 via-[#185FA5] to-blue-500 bg-clip-text text-transparent">
                  Wealth Management.
                </span> <br />
                Directed by AI.
              </h1>

              <p className="text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed font-inter" style={{ color: 'var(--text-secondary)' }}>
                Unlock multi-asset portfolios, deep quant research, and the Kautilya Risk Engine. We combine institutional foresight with advanced machine intelligence to grow your wealth.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
                <a
                  href="#optimizer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
                >
                  <span>Optimize Portfolio</span>
                  <ChevronRight className="h-5 w-5" />
                </a>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-theme-elevated border border-theme hover:border-blue-500/50 hover:bg-slate-800/50 text-theme-primary font-bold text-base backdrop-blur-md transition-all duration-300"
                >
                  <Cpu className="h-5 w-5 text-blue-400" />
                  <span>AI Stock Forecasting</span>
                </Link>
              </div>

              {/* Subtext */}
              <div className="flex items-center justify-center lg:justify-start gap-3 text-xs text-theme-muted font-semibold pt-4">
                <Shield className="h-4 w-4 text-emerald-500/80" />
                <span>Advanced Bank-Grade AES 256-Bit Protection & Regulatory Compliant</span>
              </div>
            </div>

            {/* Right Floating Glassmorphic Dashboard */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative group w-full max-w-[480px]">
                
                {/* Glow Behind Dashboard */}
                <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-violet-500/30 blur-3xl group-hover:opacity-60 opacity-40 transition duration-700" />
                
                {/* Dashboard Frame */}
                <div className="relative bg-theme-card/80 border border-theme-secondary rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl">
                  
                  {/* Header elements */}
                  <div className="flex items-center justify-between border-b border-theme-secondary/50 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                        <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      </span>
                      <span className="text-xs font-bold text-theme-secondary ml-3 tracking-wide">Kautilya Core V2.8</span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Active Risk Oversight
                      </span>
                    </div>
                  </div>

                  {/* SVG glowing chart */}
                  <div className="h-48 w-full bg-slate-900/50 rounded-2xl border border-slate-700/50 p-2 flex items-end relative overflow-hidden mb-5 group-hover:border-slate-600/50 transition-colors">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area under curve */}
                      <path
                        d="M 0 80 Q 20 40 40 50 T 80 20 T 100 10 L 100 100 L 0 100 Z"
                        fill="url(#chartGrad)"
                        className="transition-all duration-1000"
                      />
                      {/* Line curve */}
                      <path
                        d="M 0 80 Q 20 40 40 50 T 80 20 T 100 10"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="transition-all duration-1000 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      />
                    </svg>
                    
                    {/* Floating Indicator */}
                    <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[10px] uppercase">NIFTY 50 Price</span>
                        <span>{tickerData && tickerData.length > 0 ? tickerData.find(t => t.name.includes("NIFTY 50"))?.price || "23,456.80" : "Loading..."}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-0 right-0 px-4 flex justify-between text-[10px] text-theme-muted font-extrabold uppercase tracking-wider">
                      <span>Q1 25</span>
                      <span>Q3 25</span>
                      <span>Q1 26</span>
                      <span>Today</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-2xl text-center backdrop-blur-sm hover:bg-slate-800/40 transition-colors">
                      <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase block">AI CAGR</span>
                      <span className="text-lg font-extrabold text-emerald-400 mt-1 block">19.8%</span>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-2xl text-center backdrop-blur-sm hover:bg-slate-800/40 transition-colors">
                      <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase block">Managed</span>
                      <span className="text-sm font-extrabold text-white mt-2 block">₹842 Cr</span>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-700/50 p-4 rounded-2xl text-center backdrop-blur-sm hover:bg-slate-800/40 transition-colors">
                      <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase block">System Risk</span>
                      <span className="text-xs font-extrabold text-emerald-400 mt-2.5 block flex items-center justify-center gap-1">
                        <Shield className="h-3 w-3" /> Optimal
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Subsequent sections context container to slide over sticky hero */}
      <div className="relative z-10 w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>


      {/* Live Market Ticker Section */}
      <section className="border-y py-3 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-ticker)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 shrink-0 pr-4 md:border-r border-theme-secondary pb-2 md:pb-0" style={{ backgroundColor: 'var(--bg-ticker)' }}>
            <span className={`h-2 w-2 rounded-full ${tickerError ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
            <span className="text-xs font-black tracking-wider text-theme-secondary uppercase whitespace-nowrap">
              {tickerError ? 'OFFLINE DATA' : 'LIVE MARKETS'}
            </span>
            {!tickerError && lastUpdated && (
              <span className="text-[9px] font-bold text-slate-600 tracking-wider whitespace-nowrap">Updated {lastUpdated}</span>
            )}
          </div>
          
          {tickerLoading ? (
            <div className="flex-1 flex gap-6 py-1 animate-pulse overflow-hidden">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-8 w-48 bg-theme-elevated rounded-lg shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex-1 flex overflow-x-auto gap-8 no-scrollbar items-center whitespace-nowrap py-1 scroll-smooth">
              {tickerData.map((ticker, index) => (
                <div key={index} className="inline-flex items-center gap-2.5 bg-theme-elevated border border-theme-secondary px-3.5 py-1.5 rounded-lg shadow-sm">
                  <span className="text-xs font-bold text-theme-secondary">{ticker.name}</span>
                  <span className="text-sm font-extrabold text-theme-primary">
                    {((ticker as any).currency as string) || '₹'}{ticker.price}
                  </span>
                  <span className={`inline-flex items-center text-xs font-bold ${ticker.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {ticker.isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {ticker.change} ({ticker.pct})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Market Overview */}
      <MarketOverview />

      {/* Top Market Stories (News) */}
      <section id="news" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto relative scroll-mt-20">
        <div className="flex items-center justify-between mb-12 border-b border-theme-secondary pb-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-black text-theme-primary">Top Market Stories</h2>
          </div>
          <Link href="/news" className="text-sm font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition">
            All News <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: '1', title: 'Reliance Jio Announces Nationwide 6G Testing Lab', category: 'NEWS', impact: 'POSITIVE', time: '2h ago' },
            { id: '2', title: 'RBI Keeps Repo Rate Unchanged at 6.5%', category: 'NEWS', impact: 'POSITIVE', time: '4h ago' },
            { id: '3', title: 'Why IT Stocks Are Facing Margin Pressures', category: 'RESEARCH', impact: 'NEGATIVE', time: '5h ago' }
          ].map((news) => (
            <Link key={news.id} href={`/news`} className="block group">
              <div className="bg-theme-surface border border-theme-secondary rounded-3xl p-6 h-full hover:border-blue-500/50 transition">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${news.impact === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {news.category}
                  </span>
                  <span className="text-xs font-bold text-theme-muted flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {news.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-theme-primary group-hover:text-blue-500 transition line-clamp-3">
                  {news.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Capabilities Section (Tabs Showcase) */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase">INVESTMENT CAPABILITIES</h2>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-theme-primary tracking-tight max-w-3xl mx-auto">
            Comprehensive Asset Management for the Modern Epoch
          </p>
          <p className="text-theme-secondary font-medium max-w-xl mx-auto text-sm sm:text-base">
            From smart actively managed mutual index funds to advanced deep learning stock forecasting models.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-theme-secondary pb-6">
          <button
            onClick={() => setActiveCapTab('quant')}
            className={`px-6 py-3 rounded-full text-sm font-extrabold transition-all duration-300 ${
              activeCapTab === 'quant'
                ? 'bg-violet-600 text-theme-primary shadow-lg shadow-violet-600/25'
                : 'text-theme-secondary hover:text-theme-primary bg-theme-card border border-theme-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>AI Quant Forecasting</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveCapTab('mutual')}
            className={`px-6 py-3 rounded-full text-sm font-extrabold transition-all duration-300 ${
              activeCapTab === 'mutual'
                ? 'bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'text-theme-secondary hover:text-theme-primary bg-theme-card border border-theme-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Optimized Mutual Baskets</span>
            </div>
          </button>

          <button
            onClick={() => setActiveCapTab('alts')}
            className={`px-6 py-3 rounded-full text-sm font-extrabold transition-all duration-300 ${
              activeCapTab === 'alts'
                ? 'bg-blue-600 text-theme-primary shadow-lg shadow-blue-600/25'
                : 'text-theme-secondary hover:text-theme-primary bg-theme-card border border-theme-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Alternative Private Markets</span>
            </div>
          </button>

          <button
            onClick={() => setActiveCapTab('retirement')}
            className={`px-6 py-3 rounded-full text-sm font-extrabold transition-all duration-300 ${
              activeCapTab === 'retirement'
                ? 'bg-[#10B981] text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-theme-secondary hover:text-theme-primary bg-theme-card border border-theme-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Retirement Reserves</span>
            </div>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-theme-surface border border-theme-secondary rounded-3xl p-6 sm:p-10 backdrop-blur-md">
          {activeCapTab === 'quant' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-black">
                  HIGH ALPHA QUANT ENGINE
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-primary tracking-tight leading-snug">
                  Weekly-Optimized Predictive Equity Baskets
                </h3>
                <p className="text-theme-secondary text-sm sm:text-base leading-relaxed font-medium">
                  Harnessing neural network embeddings, we analyze over 4,000 data points daily—including technical momentum indices, earnings trajectories, and macro developments—to compute short-term predictive trends for domestic equities.
                </p>
                <ul className="space-y-3 font-semibold text-sm text-theme-secondary">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-violet-400" />
                    <span>Dynamic weekly portfolio re-optimization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-violet-400" />
                    <span>Deep learning predictive factor analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-violet-400" />
                    <span>Backtested outperformance over the NIFTY 50 by 8.4% average</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-750 text-theme-primary font-extrabold text-sm transition"
                  >
                    <span>View AI Forecasting Dashboard</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 bg-theme-card border border-theme-secondary rounded-2xl p-6 space-y-6">
                <span className="text-xs font-extrabold text-theme-muted tracking-wider block uppercase">FLAGSHIP AI BASKET STATUS</span>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-theme-secondary pb-3">
                    <div>
                      <h4 className="font-extrabold text-theme-primary text-sm">Tradox Capital Quant India Alpha</h4>
                      <span className="text-[10px] text-theme-muted font-bold uppercase">12 Tech & Capital Goods holdings</span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400">+24.8% (12m)</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-theme-secondary pb-3">
                    <div>
                      <h4 className="font-extrabold text-theme-primary text-sm">Automated ESG Green Transition</h4>
                      <span className="text-[10px] text-theme-muted font-bold uppercase">8 Solar & Hydro infrastructure holdings</span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400">+19.2% (12m)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-theme-primary text-sm">Alternative Sovereign Hedge</h4>
                      <span className="text-[10px] text-theme-muted font-bold uppercase">Gold, arbitrage & inverse volatility</span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400">+9.5% (12m)</span>
                  </div>
                </div>

                <div className="bg-theme-primary p-4.5 rounded-xl border border-theme-secondary text-center">
                  <span className="text-[10px] text-theme-muted font-extrabold block">NEXT SIMULATION MODEL RUN</span>
                  <span className="text-base font-extrabold text-theme-primary mt-1 block">Every Sunday at 18:30 IST</span>
                </div>
              </div>
            </div>
          )}

          {activeCapTab === 'mutual' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-black">
                  OPTIMIZED MUTUAL BASKETS
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-primary tracking-tight leading-snug">
                  Curated Diversification. Rebalanced Automatically.
                </h3>
                <p className="text-theme-secondary text-sm sm:text-base leading-relaxed font-medium">
                  Avoid choice overload. We monitor more than 400 Indian Mutual Funds, hand-selecting premier performers across Equity, Debt, and Commodities, and blending them into risk-adjusted portfolios that rebalance as market conditions shift.
                </p>
                <ul className="space-y-3 font-semibold text-sm text-theme-secondary">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span>Real-time NAV tracking and automatic ledger compilation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span>Cost-efficient allocation avoiding high-expense loads</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span>Comprehensive analytics spanning XIRR, absolute gains, and SIP targets</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/investment"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm transition"
                  >
                    <span>Explore Mutual Optimizer</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 bg-theme-card border border-theme-secondary rounded-2xl p-6 space-y-6">
                <span className="text-xs font-extrabold text-theme-muted tracking-wider block uppercase">PREMIER MUTUAL SELECTIONS</span>
                <div className="space-y-3.5">
                  <div className="bg-theme-elevated border border-theme p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-theme-secondary font-extrabold block">Top Hybrid Selection</span>
                      <span className="text-sm font-extrabold text-theme-primary">Arbitrage Allocation Fund</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Low Volatility</span>
                  </div>
                  <div className="bg-theme-elevated border border-theme p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-theme-secondary font-extrabold block">Top Equity Alpha</span>
                      <span className="text-sm font-extrabold text-theme-primary">Focus Large & Mid-Cap</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">High Growth</span>
                  </div>
                  <div className="bg-theme-elevated border border-theme p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-theme-secondary font-extrabold block">Top Inflation Hedge</span>
                      <span className="text-sm font-extrabold text-theme-primary">Sovereign Commodity Blend</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Defensive</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCapTab === 'alts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-black">
                  ALTERNATIVE PRIVATE MARKETS
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-primary tracking-tight leading-snug">
                  Access Premium Yields in Non-Public Assets
                </h3>
                <p className="text-theme-secondary text-sm sm:text-base leading-relaxed font-medium">
                  Democratizing access to high-yield institutional credit, fractional high-end commercial real estate (A-grade warehouses, IT parks), and private distressed debt. Previously reserved for multi-family offices, now accessible to qualified investors.
                </p>
                <ul className="space-y-3 font-semibold text-sm text-theme-secondary">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-400" />
                    <span>Target yields of 12.5% to 15.5% fixed IRR</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-400" />
                    <span>Collateralized assets with structural liquidation protection</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-400" />
                    <span>Low correlation with volatile public stock market indices</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/financial"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-750 text-theme-primary font-extrabold text-sm transition"
                  >
                    <span>Read Financial Structures</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 bg-theme-card border border-theme-secondary rounded-2xl p-6 space-y-5">
                <span className="text-xs font-extrabold text-theme-muted tracking-wider block uppercase">ACTIVE ALTERNATIVE VAULTS</span>
                <div className="space-y-3.5">
                  <div className="border border-theme-secondary p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-theme-primary">Logistics Warehouse Yield IV</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold">13.8% IRR</span>
                    </div>
                    <p className="text-[11px] text-theme-muted font-medium">Secured by long-term corporate leases in Mumbai Logistics Hub.</p>
                  </div>
                  <div className="border border-theme-secondary p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-theme-primary">SME Structured Debt Fund</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold">14.5% IRR</span>
                    </div>
                    <p className="text-[11px] text-theme-muted font-medium">Collateralized short-term factoring loans for high-growth firms.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCapTab === 'retirement' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                  RETIREMENT RESERVES
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-primary tracking-tight leading-snug">
                  Tax-Efficient Decumulation Planning
                </h3>
                <p className="text-theme-secondary text-sm sm:text-base leading-relaxed font-medium">
                  Accumulating wealth is only half the battle. Our Retirement planning module focuses on complex decumulation structures, ensuring high tax-efficiency, automated monthly withdrawals (SWPs), and reliable cashflow indexing that grows alongside inflation.
                </p>
                <ul className="space-y-3 font-semibold text-sm text-theme-secondary">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>SWP (Systematic Withdrawal Plan) optimization models</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>LTCG (Long-Term Capital Gains) minimization algorithms</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>Dynamic cash reserve buffers protecting against market drawdowns</span>
                  </li>
                </ul>
                <div className="pt-2">
                  <Link
                    href="/retirement"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm transition"
                  >
                    <span>Open Retirement Planner</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 bg-theme-card border border-theme-secondary rounded-2xl p-6 text-center space-y-4">
                <span className="text-xs font-extrabold text-theme-muted tracking-wider block uppercase">SIMULATED DECAPITALIZATION STATUS</span>
                
                <div className="bg-theme-elevated border border-theme-secondary rounded-xl p-4.5 text-left space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-theme-secondary font-extrabold">Retirement Target Goal</span>
                    <span className="font-extrabold text-theme-primary">₹5.00 Cr</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-theme-secondary font-extrabold">Monthly Income Target</span>
                    <span className="font-extrabold text-theme-primary">₹2.50 Lakh</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-theme-secondary font-extrabold">Portfolio Durability</span>
                    <span className="font-extrabold text-emerald-400">32 Years (Safe)</span>
                  </div>
                </div>

                <p className="text-[11px] text-theme-muted font-semibold leading-relaxed">
                  Calculated using standard inflation of 6.0% and defensive allocation yielding 9.2% passive compounding.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive SIP & Portfolio Optimizer Section */}
      <section id="optimizer" className="py-20 lg:py-28 border-y relative" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-900/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Interactive Calculator Controls */}
            <div className="lg:col-span-6 space-y-8 bg-[#040913] border border-theme-secondary rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-emerald-400 tracking-wider block uppercase">Tradox Capital PORTFOLIO OPTIMIZER</span>
                <h3 className="text-2xl sm:text-3xl font-black text-theme-primary">
                  Estimate Your Financial Future Instantly
                </h3>
                <p className="text-theme-secondary text-sm font-medium">
                  Adjust target SIP capital, choose your risk profile, and see how our dynamic active models allocate and compound wealth.
                </p>
              </div>

              <div className="space-y-6">
                {/* 1. Monthly SIP Amount */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-theme-secondary uppercase">MONTHLY INVESTMENT (SIP)</label>
                    <span className="text-lg font-black text-emerald-400">₹{sipAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-theme-elevated rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-theme-muted font-extrabold">
                    <span>₹5K</span>
                    <span>₹50K</span>
                    <span>₹1L</span>
                    <span>₹1.5L</span>
                    <span>₹2L</span>
                  </div>
                </div>

                {/* 2. Risk Profile Selection */}
                <div className="space-y-2.5">
                  <label className="text-xs font-black text-theme-secondary uppercase block">INVESTMENT RISK TOLERANCE</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'defensive', val: 'Defensive' },
                      { key: 'balanced', val: 'Balanced' },
                      { key: 'growth', val: 'Growth' },
                      { key: 'speculative', val: 'Quant Spec' }
                    ].map((prof) => (
                      <button
                        key={prof.key}
                        onClick={() => setRiskProfile(prof.key)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition border ${
                          riskProfile === prof.key
                            ? 'bg-emerald-500 text-slate-950 border-emerald-500'
                            : 'bg-theme-card text-theme-secondary border-theme-secondary hover:text-theme-primary hover:border-theme'
                        }`}
                      >
                        {prof.val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Duration Years */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-theme-secondary uppercase">INVESTMENT DURATION</label>
                    <span className="text-lg font-black text-emerald-400">{durationYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="25"
                    step="1"
                    value={durationYears}
                    onChange={(e) => setDurationYears(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-theme-elevated rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-theme-muted font-extrabold">
                    <span>3 Years</span>
                    <span>10 Years</span>
                    <span>15 Years</span>
                    <span>20 Years</span>
                    <span>25 Years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Portfolio Allocation & Math Output */}
            <div className="lg:col-span-6 space-y-8">
              <div className="bg-theme-surface border border-theme-secondary rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* Result Math Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-theme-secondary pb-6">
                  <div>
                    <span className="text-[10px] text-theme-muted font-black tracking-wider uppercase block">Total Invested</span>
                    <span className="text-xl font-extrabold text-theme-primary mt-1 block">₹{totalInvested.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted font-black tracking-wider uppercase block">Est. Growth Returns</span>
                    <span className="text-xl font-extrabold text-emerald-400 mt-1 block">₹{estimatedReturns.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-theme-muted font-black tracking-wider uppercase block">Future Wealth</span>
                    <span className="text-2xl font-black text-theme-primary mt-0.5 block">₹{futureValue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Return CAGR highlight */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-[#07132a]/45 border border-theme-secondary rounded-2xl p-4.5 gap-3">
                  <div>
                    <span className="text-xs font-extrabold text-theme-primary flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                      {riskDetails.label}
                    </span>
                    <span className="text-[10.5px] text-theme-secondary font-medium block mt-1 leading-relaxed">
                      {riskDetails.description}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-emerald-400 block">{riskDetails.cagr}% Estimated CAGR</span>
                  </div>
                </div>

                {/* Allocation Stack Bar */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-theme-secondary uppercase block">RECOMMENDED DYNAMIC ALLOCATION</label>
                  
                  {/* Visual allocation stacked bar */}
                  <div className="h-4 w-full rounded-full flex overflow-hidden bg-theme-elevated border border-slate-950">
                    {riskDetails.allocation.map((alloc, idx) => (
                      <div
                        key={idx}
                        className={`h-full ${alloc.color} transition-all duration-500`}
                        style={{ width: `${alloc.pct}%` }}
                        title={`${alloc.asset}: ${alloc.pct}%`}
                      />
                    ))}
                  </div>

                  {/* Allocation Legends */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1.5">
                    {riskDetails.allocation.map((alloc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span className={`h-2.5 w-2.5 rounded-full ${alloc.color} shrink-0 mt-0.5`} />
                        <div>
                          <span className="font-extrabold text-theme-primary block">{alloc.pct}%</span>
                          <span className="text-[10px] text-theme-muted font-bold block">{alloc.asset}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-center sm:text-left">
                  <Link
                    href="/investment"
                    className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <span>Proceed to full interactive allocator panel</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tradox Capital Investment Institute (Tradox) Section */}
      <section id="insights" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto relative scroll-mt-20">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase">Tradox Capital INVESTMENT INSTITUTE</h2>
            <p className="text-3xl sm:text-4xl font-black text-theme-primary tracking-tight leading-snug">
              Institutional Market Insights & Foresight
            </p>
            <p className="text-theme-secondary font-medium max-w-xl text-sm sm:text-base">
              Macroeconomic intelligence and portfolio research written by our core quant research desk.
            </p>
          </div>
          
          {/* Insights Filters */}
          <div className="flex flex-wrap items-center gap-2 border-b border-theme-secondary pb-2 md:pb-0">
            {[
              { key: 'all', val: 'All Commentary' },
              { key: 'macro', val: 'Macro Strategy' },
              { key: 'tech', val: 'AI & Innovation' },
              { key: 'geopolitical', val: 'Geopolitical' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveInsightTab(tab.key)}
                className={`px-4.5 py-2 rounded-full text-xs font-extrabold transition-all duration-200 ${
                  activeInsightTab === tab.key
                    ? 'bg-theme-elevated text-theme-primary border border-theme'
                    : 'text-theme-muted hover:text-slate-350'
                }`}
              >
                {tab.val}
              </button>
            ))}
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className="group bg-theme-card border border-theme-secondary rounded-2xl p-5 hover:border-theme transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual Header Glow */}
                <div className={`h-28 w-full rounded-xl bg-gradient-to-br ${insight.imageGrad} border border-theme-secondary flex items-center justify-center relative overflow-hidden`}>
                  <BookOpen className="h-7 w-7 text-theme-muted group-hover:scale-110 transition duration-300 z-10" />
                  <div className="absolute inset-0 bg-theme-card backdrop-blur-[2px]" />
                </div>

                <div className="flex items-center justify-between text-[10px] font-black text-emerald-400 tracking-wider uppercase">
                  <span>{insight.categoryLabel}</span>
                  <span className="text-theme-muted">{insight.readTime}</span>
                </div>

                <h3 className="font-extrabold text-theme-primary text-sm sm:text-base leading-snug group-hover:text-emerald-400 transition duration-200">
                  {insight.title}
                </h3>

                <p className="text-xs text-theme-secondary leading-relaxed font-medium line-clamp-3">
                  {insight.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-theme-secondary mt-6 space-y-2">
                <span className="text-[10px] text-theme-muted font-extrabold block">{insight.date}</span>
                <span className="text-[11px] text-theme-secondary font-bold block">{insight.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Market News Section — Powered by LiveMint */}
      {(liveNews.length > 0 || newsLoading) && (
        <section className="py-20 lg:py-28 border-y relative" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <h2 className="text-xs font-extrabold tracking-widest text-rose-400 uppercase">LIVE MARKET NEWS</h2>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-theme-primary tracking-tight leading-snug">
                  Breaking Market Intelligence
                </p>
                <p className="text-theme-secondary font-medium max-w-xl text-sm sm:text-base">
                  Real-time stock and market headlines from LiveMint, auto-refreshed every 2 minutes.
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-theme-elevated border border-theme">
                <Newspaper className="h-3.5 w-3.5 text-theme-secondary" />
                <span className="text-[10px] font-bold text-theme-secondary uppercase tracking-wider">Source: LiveMint</span>
              </div>
            </div>

            {newsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-theme-elevated border border-theme-secondary rounded-2xl p-6 space-y-4">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Featured Article — first item gets a large card */}
                {liveNews.length > 0 && (
                  <a
                    href={liveNews[0].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:col-span-2 group bg-theme-gradient border border-theme rounded-2xl p-6 sm:p-8 hover:border-slate-700 transition duration-300 flex flex-col sm:flex-row gap-6"
                  >
                    {liveNews[0].image && (
                      <div className="sm:w-64 shrink-0 h-40 sm:h-auto rounded-xl overflow-hidden bg-theme-elevated border border-theme">
                        <img
                          src={liveNews[0].image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
                        <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/20">BREAKING</span>
                        <span className="flex items-center gap-1 text-theme-muted">
                          <Clock className="h-3 w-3" />
                          {new Date(liveNews[0].pubDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-theme-primary leading-snug group-hover:text-emerald-400 transition duration-200">
                        {liveNews[0].title}
                      </h3>
                      {liveNews[0].description && (
                        <p className="text-sm text-theme-secondary leading-relaxed font-medium line-clamp-3">
                          {liveNews[0].description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 pt-1">
                        <span>Read on {liveNews[0].source}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                  </a>
                )}

                {/* Remaining articles */}
                {liveNews.slice(1, showAllNews ? liveNews.length : 10).map((article, index) => (
                  <a
                    key={index}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-theme-surface border border-theme-secondary rounded-2xl p-5 hover:border-theme transition duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                        <span className="text-theme-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(article.pubDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-slate-600">{article.source}</span>
                      </div>

                      <h4 className="font-extrabold text-theme-primary text-sm leading-snug group-hover:text-emerald-400 transition duration-200 line-clamp-3">
                        {article.title}
                      </h4>

                      {article.description && (
                        <p className="text-xs text-theme-muted leading-relaxed font-medium line-clamp-2">
                          {article.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400/70 mt-4 pt-3 border-t border-theme-secondary">
                      <ExternalLink className="h-3 w-3" />
                      <span>Read full article</span>
                    </div>
                  </a>
                ))}
              </div>

              {/* View All Button */}
              {liveNews.length > 10 && (
                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={() => setShowAllNews(!showAllNews)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-theme-surface border border-theme-secondary text-theme-primary text-sm font-bold hover:border-theme hover:bg-theme-elevated transition-all shadow-sm hover:shadow-md"
                  >
                    {showAllNews ? 'Show Less News' : 'View All Breaking News'} 
                    <ChevronDown className={`h-4.5 w-4.5 text-emerald-400 transition-transform duration-300 ${showAllNews ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
              </>
            )}

          </div>
        </section>
      )}

      {/* Five Megatrends Section */}
      <section className="py-20 lg:py-28 border-y relative" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase">MACRO REGIMES</h2>
            <p className="text-3xl sm:text-4xl font-black text-theme-primary tracking-tight">
              Five Global Megatrends Reshaping Wealth
            </p>
            <p className="text-theme-secondary font-medium max-w-xl mx-auto text-sm sm:text-base">
              The macroeconomic drivers creating structurally higher volatility, shifting traditional portfolio parameters forever.
            </p>
          </div>

          {/* Megatrend Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                num: "01",
                title: "The AI Epoch",
                description: "AI-driven machine efficiency is rewriting industry cost structures. We invest directly in semiconductor infrastructure, data centers, and advanced technology equities.",
                icon: Cpu,
                glow: "group-hover:border-violet-500/30 hover:shadow-violet-600/5"
              },
              {
                num: "02",
                title: "Supply Chain Re-routing",
                description: "Geopolitical block fragmentation requires multi-polar industrial relocation. India represents the primary capital recipient in critical electronic and transport manufacturing.",
                icon: Globe,
                glow: "group-hover:border-emerald-500/30 hover:shadow-emerald-600/5"
              },
              {
                num: "03",
                title: "Demographic Shift",
                description: "Aging Western consumer demographics contrast sharply with emerging-market consumption expansions, shifting global growth drivers toward Southeast Asia.",
                icon: Users,
                glow: "group-hover:border-blue-500/30 hover:shadow-blue-600/5"
              },
              {
                num: "04",
                title: "Energy & Infrastructure",
                description: "Building solar capacities, green hydrogen, and storage infrastructure represents a multi-trillion dollar transition. We locate high-yield capital allocation opportunities.",
                icon: Activity,
                glow: "group-hover:border-pink-500/30 hover:shadow-pink-600/5"
              },
              {
                num: "05",
                title: "Alternative Finance",
                description: "Real-world asset tokenization, high-yield structured private credit, and decentralized transaction structures are unlocking massive alternative liquidity pools.",
                icon: BadgeDollarSign,
                glow: "group-hover:border-amber-500/30 hover:shadow-amber-600/5"
              }
            ].map((trend, idx) => {
              const IconComp = trend.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-theme-card border border-theme-secondary rounded-2xl p-6 hover:-translate-y-1 transition duration-300 flex flex-col justify-between ${trend.glow}`}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-slate-700 font-mono">{trend.num}</span>
                      <IconComp className="h-5 w-5 text-theme-muted group-hover:text-emerald-400 transition duration-300" />
                    </div>
                    
                    <h3 className="text-base font-black text-theme-primary tracking-tight">
                      {trend.title}
                    </h3>
                    
                    <p className="text-xs text-theme-secondary leading-relaxed font-medium">
                      {trend.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Kautilya Risk Engine Stress-Tester (Our Aladdin) */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-black">
              PROPRIETARY TECHNOLOGY PLATFORM
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-theme-primary tracking-tight leading-snug">
              The Kautilya Risk Engine: Stress-Test Your Wealth
            </h2>
            
            <p className="text-theme-secondary font-medium text-sm sm:text-base leading-relaxed">
              We don't trust static benchmarks. Kautilya continually simulates major macroeconomic stress events, tracking how custom mutual funds, active quant engines, and alternative hedges weather the shock compared to traditional static portfolios.
            </p>

            <div className="space-y-4">
              <label className="text-xs font-black text-theme-secondary uppercase block">SELECT SIMULATOR SCENARIO</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { key: 'stagflation', val: 'Energy Stagflation' },
                  { key: 'ai_leap', val: 'AI Hardware Boom' },
                  { key: 'trade_war', val: 'Trade Decoupling' }
                ].map((scen) => (
                  <button
                    key={scen.key}
                    onClick={() => setStressScenario(scen.key)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition text-left border ${
                      stressScenario === scen.key
                        ? 'bg-blue-600/90 text-theme-primary border-blue-500'
                        : 'bg-theme-card text-theme-secondary border-theme-secondary hover:text-theme-primary hover:border-theme'
                    }`}
                  >
                    {scen.val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Live Simulation Graph Dashboard */}
          <div className="lg:col-span-6">
            <div className="bg-theme-surface border border-theme-secondary rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              {/* Simulator Header */}
              <div className="flex justify-between items-center border-b border-theme-secondary pb-4">
                <div>
                  <span className="text-[10px] text-theme-muted font-black tracking-wider uppercase block">SIMULATOR OUTPUT</span>
                  <h4 className="font-extrabold text-theme-primary text-base mt-0.5">{stressMetrics.scenarioName}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-theme-muted font-black tracking-wider uppercase block">SYSTEM SHIELD GRADE</span>
                  <span className="text-lg font-black text-emerald-400 mt-0.5 block">{stressMetrics.resilienceGrade}</span>
                </div>
              </div>

              {/* Simulation Graph */}
              <div className="h-44 w-full bg-theme-card rounded-xl border border-theme-secondary p-3 flex items-end relative overflow-hidden">
                
                {/* SVG Curve Points shifting dynamically with React State! */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="simKautGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="simIndexGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Traditional Index Curve (drawdown) */}
                  <path
                    d={`M 0 60 Q 25 ${stressScenario === 'ai_leap' ? 55 : 75} 50 ${stressScenario === 'ai_leap' ? 50 : 85} T 100 ${stressScenario === 'ai_leap' ? 40 : 90}`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Kautilya Shielded Curve */}
                  <path
                    d={`M 0 60 Q 25 ${100 - stressMetrics.chartPoints[1]} 50 ${100 - stressMetrics.chartPoints[2]} T 75 ${100 - stressMetrics.chartPoints[4]} T 100 ${100 - stressMetrics.chartPoints[5]}`}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                  />
                  <path
                    d={`M 0 60 Q 25 ${100 - stressMetrics.chartPoints[1]} 50 ${100 - stressMetrics.chartPoints[2]} T 75 ${100 - stressMetrics.chartPoints[4]} T 100 ${100 - stressMetrics.chartPoints[5]} L 100 100 L 0 100 Z`}
                    fill="url(#simKautGrad)"
                  />
                </svg>

                {/* Graph Legends */}
                <div className="absolute top-3 left-3 space-y-1 text-[9px] font-black tracking-wider uppercase">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <span className="h-1 w-3 bg-blue-500 rounded" />
                    <span>Tradox Capital Portfolio</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <span className="h-1 w-3 bg-rose-500 rounded border-dashed" />
                    <span>Static Benchmark Index</span>
                  </div>
                </div>

                <div className="absolute bottom-2 left-0 right-0 px-3 flex justify-between text-[8px] text-theme-muted font-extrabold uppercase">
                  <span>Start Shock</span>
                  <span>T+3 Months</span>
                  <span>T+6 Months</span>
                  <span>Recovery Epoch</span>
                </div>
              </div>

              {/* Simulation Insights */}
              <div className="grid grid-cols-2 gap-4 bg-theme-card p-4 rounded-xl border border-theme-secondary">
                <div>
                  <span className="text-[9px] text-theme-muted font-black tracking-wider uppercase block">SIMULATED PORTFOLIO</span>
                  <span className={`text-base font-extrabold mt-1 block ${stressScenario === 'ai_leap' || parseFloat(stressMetrics.kautilyaImpact) >= 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {stressMetrics.kautilyaImpact}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-theme-muted font-black tracking-wider uppercase block">STATIC BENCHMARK</span>
                  <span className="text-base font-extrabold text-rose-500 mt-1 block">{stressMetrics.niftyImpact}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-theme-muted font-black tracking-wider uppercase block">KAUTILYA AUTONOMOUS ACTION TRIGGERED</span>
                <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                  {stressMetrics.actionTaken}
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Trust, Security & Fiduciary Section */}
      <section className="py-20 lg:py-28 border-t relative" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase">FIDUCIARY DUTY</h2>
            <p className="text-3xl sm:text-4xl font-black text-theme-primary tracking-tight">
              A Mandate Founded on Trust & Regulatory Oversight
            </p>
            <p className="text-theme-secondary font-medium max-w-xl mx-auto text-sm sm:text-base">
              Operating under strict compliance to shield your capital, maintain confidentiality, and ensure transactional transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-theme-surface border border-theme-secondary p-8 rounded-2xl space-y-4 text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto sm:mx-0">
                <Lock className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-theme-primary text-base">Bank-Grade Encryption</h3>
              <p className="text-xs text-theme-secondary leading-relaxed font-semibold">
                Your portfolio holdings, bank credentials, and analytical projections are secured using state-of-the-art AES 255-bit SSL encryption protocols.
              </p>
            </div>
            <div className="bg-theme-surface border border-theme-secondary p-8 rounded-2xl space-y-4 text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto sm:mx-0">
                <Building className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-extrabold text-theme-primary text-base">Regulatory Alignment</h3>
              <p className="text-xs text-theme-secondary leading-relaxed font-semibold">
                We align fully with SEBI, AMFI, and relevant sovereign security guidelines, prioritizing the stability and integrity of all client transactions.
              </p>
            </div>
            <div className="bg-theme-surface border border-theme-secondary p-8 rounded-2xl space-y-4 text-center sm:text-left">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center mx-auto sm:mx-0">
                <Award className="h-5 w-5 text-violet-400" />
              </div>
              <h3 className="font-extrabold text-theme-primary text-base">Fiduciary Responsibility</h3>
              <p className="text-xs text-theme-secondary leading-relaxed font-semibold">
                We operate on a pure fee or direct allocation alignment basis. We accept no kickbacks or hidden broker expenses, aligning our goals with yours.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl w-full mx-auto relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-extrabold tracking-widest text-emerald-400 uppercase text-center">COMMON QUESTIONS</h2>
          <p className="text-3xl sm:text-4xl font-black text-theme-primary tracking-tight text-center">
            Frequently Asked Queries
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-theme-surface border border-theme-secondary rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left font-extrabold text-theme-primary hover:text-emerald-400 transition"
                >
                  <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4.5 w-4.5 text-theme-muted shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-theme-secondary">
                    <p className="text-xs sm:text-sm text-theme-secondary leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="bg-theme-gradient border-t border-theme-secondary py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-theme-primary tracking-tight leading-tight">
            Ready to Partner with the <br className="hidden sm:inline" />
            Future of Asset Management?
          </h2>
          <p className="text-theme-secondary font-medium max-w-xl mx-auto text-sm sm:text-base">
            Start structuring your automated portfolio, stress-testing with Kautilya, and viewing active weekly AI predictions today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#optimizer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm transition"
            >
              <TrendingUp className="h-4.5 w-4.5" />
              <span>Investment Allocator</span>
            </a>
            <Link
              href="/retirement"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-violet-600 hover:bg-violet-750 text-theme-primary font-bold text-sm transition"
            >
              <span>Retirement Reserves</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional-Grade Mega-Footer */}
      <footer className="border-t pt-16 pb-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Main Footer Links & Structure */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-theme-secondary">
            
            {/* Col 1: Capabilities */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-theme-primary tracking-wider uppercase">CAPABILITIES</h4>
              <ul className="space-y-2 text-xs font-semibold text-theme-secondary">
                <li><Link href="/investment" className="hover:text-emerald-400 transition">Optimized Mutual Baskets</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald-400 transition">AI Quant Stock Baskets</Link></li>
                <li><Link href="/financial" className="hover:text-emerald-400 transition">Alternative Private Credit</Link></li>
                <li><Link href="/retirement" className="hover:text-emerald-400 transition">SWP Retirement Plans</Link></li>
              </ul>
            </div>

            {/* Col 2: Research & Insights */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-theme-primary tracking-wider uppercase">RESEARCH</h4>
              <ul className="space-y-2 text-xs font-semibold text-theme-secondary">
                <li><span className="text-slate-600">Tradox Capital Investment Institute</span></li>
                <li><span className="text-slate-600">Weekly Macro outlooks</span></li>
                <li><span className="text-slate-600">Generative Alpha Whitepapers</span></li>
                <li><span className="text-slate-600">Risk Stress-Test Schematics</span></li>
              </ul>
            </div>

            {/* Col 3: Technology */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-theme-primary tracking-wider uppercase">TECHNOLOGY</h4>
              <ul className="space-y-2 text-xs font-semibold text-theme-secondary">
                <li><span className="text-slate-600">Kautilya Core V2.8</span></li>
                <li><span className="text-slate-600">Quantitative API Access</span></li>
                <li><span className="text-slate-600">Fiduciary Automation Node</span></li>
                <li><span className="text-slate-600">AES 256 Encryption Standard</span></li>
              </ul>
            </div>

            {/* Col 4: Corporate */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-theme-primary tracking-wider uppercase">CORPORATE</h4>
              <ul className="space-y-2 text-xs font-semibold text-theme-secondary">
                <li><Link href="/partner" className="hover:text-emerald-400 transition">Partner Brokers</Link></li>
                <li><span className="text-slate-600">Advisory Board</span></li>
                <li><span className="text-slate-600">Press Room</span></li>
                <li><span className="text-slate-600">Sovereign Compliance</span></li>
              </ul>
            </div>

          </div>

          {/* Legal Disclaimers & Disclosures (BlackRock Style) */}
          <div className="space-y-4 text-[10px] text-theme-muted leading-relaxed font-semibold">
            <div className="flex items-center gap-1.5 mb-2">
              <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <rect width="100" height="100" rx="20" fill="#042C53" />
                <rect x="30" y="20" width="40" height="10" rx="2" fill="white" />
                <path d="M50 35 L75 65 L60 65 L60 85 L40 85 L40 65 L25 65 Z" fill="white" />
              </svg>
              <span className="text-xs font-extrabold text-theme-primary tracking-tight ml-1">Tradox </span>
              <span className="text-xs font-extrabold text-emerald-400 tracking-tight flex items-center">
                Capital
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400 ml-0.5" />
              </span>
              <span className="border-l border-theme-secondary pl-2 text-[9px] text-slate-600 uppercase font-black tracking-widest ml-1">
                WEALTH & RISK TECHNOLOGY
              </span>
            </div>
            
            <p>
              **Mutual Fund Regulatory Disclaimer:** Mutual fund investments are subject to market risks, read all scheme related documents carefully before investing. The value of investments and the income from them can fall as well as rise and is not guaranteed. You may not get back the amount originally invested. Past performance is not a reliable indicator of future results and should not be the sole factor of consideration when selecting a product or strategy.
            </p>
            
            <p>
              **AI Modeling Disclaimer:** Quantitative model signals, stock predictions, and mathematical compound calculations shown on this site represent automated simulations. They do not constitute guaranteed returns or personalized financial advice. Under SEBI and global financial guidelines, actual trading outcomes may vary significantly depending on execution timing, capital sizes, transaction costs, and market liquidity conditions during volatile regimes.
            </p>

            <p>
              **Kautilya Stress-Tester Information:** Simulated risk tests are mathematically modeled scenarios leveraging historical price volatility and forward-looking economic projections. They are not historical guarantees. Portfolios rebalanced through Kautilya parameters are subject to the same systemic risks as the broader indices.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-theme-secondary text-slate-600 font-extrabold text-[9px]">
              <span>© {new Date().getFullYear()} Tradox Capital LTD. ALL RIGHTS RESERVED. REGISTERED INC.</span>
              <div className="flex gap-4">
                <span className="hover:text-theme-secondary cursor-pointer">PRIVACY POLICY</span>
                <span className="hover:text-theme-secondary cursor-pointer">TERMS OF USE</span>
                <span className="hover:text-theme-secondary cursor-pointer">SEBI DISCLOSURES</span>
              </div>
            </div>
          </div>

        </div>
      </footer>
      </div>
    </div>
  );
}
