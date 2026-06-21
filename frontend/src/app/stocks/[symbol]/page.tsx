"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/components/ThemeProvider';
import dynamic from 'next/dynamic';
import { 
  TrendingUp, TrendingDown, ArrowRightLeft, Lock, ChevronRight, 
  CheckCircle2, ShieldAlert, Activity, ArrowLeft, Brain, BarChart3, Newspaper, DollarSign, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import CdslModal from '@/components/CdslModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const brokers = [
  { id: 'zerodha', name: 'Zerodha Kite', color: 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/30' },
  { id: 'upstox', name: 'Upstox Pro', color: 'bg-[#512DA8]/10 text-[#512DA8] border-[#512DA8]/30' },
  { id: 'angel', name: 'Angel One', color: 'bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/30' },
  { id: 'groww', name: 'Groww', color: 'bg-[#00D09C]/10 text-[#00D09C] border-[#00D09C]/30' },
];

const TABS = [
  { id: 'chart', label: 'Advanced Chart', icon: Activity },
  { id: 'market', label: 'Market Analysis', icon: BarChart3 },
  { id: 'ai', label: 'AI Analysis', icon: Brain },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'financials', label: 'Financials', icon: DollarSign },
];

const CHART_STUDIES = [
  "RSI@tv-basicstudies",
  "MACD@tv-basicstudies",
  "BollingerBands@tv-basicstudies",
  "MASimple@tv-basicstudies"
];

const RawTradingView = React.memo(({ symbol, theme }: { symbol: string, theme: string }) => {
  const containerId = `tv_chart_${symbol.replace(':', '_')}`;
  
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear previous script if any
    container.innerHTML = '';
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          "autosize": true,
          "symbol": symbol,
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": theme as any,
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "backgroundColor": theme === 'dark' ? '#0f172a' : '#ffffff',
          "hide_top_toolbar": false,
          "hide_legend": false,
          "hide_side_toolbar": false,
          "withdateranges": true,
          "allow_symbol_change": true,
          "details": true,
          "hotlist": true,
          "calendar": true,
          "studies": CHART_STUDIES,
          "save_image": true,
          "container_id": containerId
        });
      }
    };
    container.appendChild(script);
  }, [symbol, theme, containerId]);

  return <div id={containerId} className="w-full h-full" />;
});

export default function StockDetailsPage() {
  const { theme } = useTheme();
  const params = useParams();
  const symbolParam = Array.isArray(params?.symbol) ? params.symbol[0] : params?.symbol || 'NSE:RELIANCE';
  const decodedSymbol = decodeURIComponent(symbolParam);
  
  // Try to parse symbol without exchange prefix for display
  const displaySymbol = decodedSymbol.includes(':') ? decodedSymbol.split(':')[1] : decodedSymbol;
  // Use BSE instead of NSE because TradingView free widgets often restrict NSE live data, 
  // causing the widget to silently fail and default to AAPL.
  const tvSymbol = `BSE:${displaySymbol}`;

  const [activeTab, setActiveTab] = useState('chart');
  
  // Broker State
  const searchParams = useSearchParams();
  const initialAction = searchParams?.get('action') === 'sell' ? 'sell' : 'buy';

  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [brokerConnected, setBrokerConnected] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [orderType, setOrderType] = useState(initialAction);
  const [orderMode, setOrderMode] = useState('market');
  const [quantity, setQuantity] = useState('10');
  const [targetPrice, setTargetPrice] = useState('');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success'>('idle');

  const [isTrading, setIsTrading] = useState(false);
  const [isCdslOpen, setIsCdslOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => { setToastType(null); }, 4000);
  };

  const executeTrade = async () => {
    setIsTrading(true);
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: orderType.toUpperCase(),
          symbol: displaySymbol,
          quantity: parseInt(quantity || '0', 10),
          price: currentPrice,
          orderType: orderMode.toUpperCase(),
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          triggerPrice: triggerPrice ? parseFloat(triggerPrice) : null
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Order placed successfully', 'success');
        setOrderStatus('success');
        setTimeout(() => setOrderStatus('idle'), 2000);
      } else {
        showToast(data.error || 'Trade failed', 'error');
      }
    } catch (e) {
      showToast('Trade execution failed due to network error', 'error');
    } finally {
      setIsTrading(false);
      setIsCdslOpen(false);
    }
  };

  const handlePlaceOrder = () => {
    const qty = parseInt(quantity || '0', 10);
    if (qty <= 0) {
      showToast('Please enter a valid quantity', 'error');
      return;
    }

    const orderModeText = orderMode === 'limit' ? ` at Limit Price of ₹${targetPrice}` : ` at Market Price`;
    const confirmMsg = `Please confirm your order:\n\nAction: ${orderType.toUpperCase()}\nSymbol: ${displaySymbol}\nQuantity: ${qty}\nType: ${orderMode.toUpperCase()}${orderModeText}`;
    
    if (window.confirm(confirmMsg)) {
      if (orderType === 'sell') {
        setIsCdslOpen(true);
      } else {
        executeTrade();
      }
    }
  };

  const [quoteData, setQuoteData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [researchData, setResearchData] = useState<any>(null);
  
  useEffect(() => {
    setMounted(true);
    const fetchQuote = async () => {
      try {
        const res = await fetch(`/api/quote?symbol=${encodeURIComponent(decodedSymbol)}`);
        if (res.ok) {
          const data = await res.json();
          setQuoteData(data);
        }
      } catch (err) {}
    };

    const fetchResearch = async () => {
      try {
        const res = await fetch(`/api/stocks/${encodeURIComponent(decodedSymbol)}/research`);
        if (res.ok) {
          const data = await res.json();
          setResearchData(data);
        }
      } catch (err) {}
    };

    fetchQuote();
    fetchResearch();
    const intervalId = setInterval(fetchQuote, 10000);
    return () => clearInterval(intervalId);
  }, [decodedSymbol]);

  const currentPrice = quoteData?.price || 0;
  const priceChange = quoteData?.change || 0;
  const changePercent = quoteData?.changePercent || 0;

  const handleConnectBroker = (brokerId: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setBrokerConnected(brokerId);
      setIsConnecting(false);
      setIsBrokerModalOpen(false);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      {/* Stock Header */}
      <div 
        className="border-b shadow-sm z-20 flex-shrink-0"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
      >
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Link href="/analysis" className="p-2 -ml-2 rounded-lg hover:bg-slate-500/10 transition">
                <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-primary)' }} />
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{displaySymbol}</h1>
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-slate-500/10" style={{ color: 'var(--text-muted)' }}>
                    NSE
                  </span>
                </div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Equity • Last updated real-time
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-2xl font-black flex items-center justify-end gap-2" style={{ color: 'var(--text-primary)' }}>
                  ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  <span className={`text-sm font-bold flex items-center ${changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {changePercent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {changePercent >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({changePercent}%)
                  </span>
                </div>
                <div className="text-xs font-semibold mt-1 flex justify-end gap-4" style={{ color: 'var(--text-muted)' }}>
                  <span>Vol: <strong style={{ color: 'var(--text-secondary)' }}>
                    {quoteData?.volume ? (quoteData.volume / 100000).toFixed(2) + 'L' : '-'}
                  </strong></span>
                  <span>Day's Range: <strong style={{ color: 'var(--text-secondary)' }}>
                    {quoteData?.dayLow && quoteData?.dayHigh 
                      ? `₹${quoteData.dayLow.toFixed(2)} - ₹${quoteData.dayHigh.toFixed(2)}` 
                      : '-'}
                  </strong></span>
                </div>
              </div>

              <div className="w-px h-10 hidden sm:block" style={{ backgroundColor: 'var(--border-primary)' }} />

              {/* Broker Connection */}
              {brokerConnected ? (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-emerald-500">Connected to {brokers.find(b => b.id === brokerConnected)?.name}</span>
                </div>
              ) : (
                <button 
                  onClick={() => setIsBrokerModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-lg shadow-blue-600/20"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Connect Broker
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive 
                      ? 'border-blue-500 text-blue-500' 
                      : 'border-transparent hover:border-slate-300'
                  }`}
                  style={{ color: isActive ? '' : 'var(--text-muted)' }}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {activeTab === 'chart' && (
            <div className="h-full min-h-[500px] w-full rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: 'var(--border-primary)' }}>
              <RawTradingView 
                symbol={tvSymbol} 
                theme={theme === 'dark' ? 'dark' : 'light'} 
              />
            </div>
          )}
          {activeTab !== 'chart' && (
            <div className="h-full w-full overflow-y-auto">
              {activeTab === 'market' && (
                <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="text-blue-500" /> Market Analysis</h3>
                  {researchData?.fundamentals ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">Market Cap</p><p className="text-lg font-bold">₹{(researchData.fundamentals.marketCap / 10000000).toFixed(2)} Cr</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">P/E Ratio</p><p className="text-lg font-bold">{researchData.fundamentals.peRatio}</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">PB Ratio</p><p className="text-lg font-bold">{researchData.fundamentals.pbRatio}</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">Dividend Yield</p><p className="text-lg font-bold">{researchData.fundamentals.dividendYield}%</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">ROE</p><p className="text-lg font-bold">{researchData.fundamentals.roe}%</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">Debt to Equity</p><p className="text-lg font-bold">{researchData.fundamentals.debtToEquity}</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">EPS</p><p className="text-lg font-bold">₹{researchData.fundamentals.eps}</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">Book Value</p><p className="text-lg font-bold">₹{researchData.fundamentals.bookValue}</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">Rev Growth</p><p className="text-lg font-bold text-emerald-400">+{researchData.fundamentals.revenueGrowth}%</p></div>
                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"><p className="text-sm text-theme-secondary">Profit Growth</p><p className="text-lg font-bold text-emerald-400">+{researchData.fundamentals.profitGrowth}%</p></div>
                      </div>
                      
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <h4 className="font-bold text-theme-primary mb-2">Company Overview</h4>
                        <p className="text-theme-secondary text-sm leading-relaxed">{researchData.fundamentals.companyOverview}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                      <p className="text-theme-secondary">No market data available for this symbol.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Brain className="text-purple-500" /> AI Analysis</h3>
                  {researchData?.aiAnalysis ? (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg font-bold text-lg ${researchData.aiAnalysis.analystConsensus === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : researchData.aiAnalysis.analystConsensus === 'SELL' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          Consensus: {researchData.aiAnalysis.analystConsensus}
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-slate-800 text-sm font-semibold">Risk: <span className={researchData.aiAnalysis.riskScore > 70 ? 'text-rose-500' : 'text-emerald-500'}>{researchData.aiAnalysis.riskScore}/100</span></div>
                        <div className="px-4 py-2 rounded-lg bg-slate-800 text-sm font-semibold">Growth: <span className="text-emerald-500">{researchData.aiAnalysis.growthScore}/100</span></div>
                      </div>
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <h4 className="font-bold mb-2">Investment Thesis</h4>
                        <p className="text-theme-secondary leading-relaxed text-sm">{researchData.aiAnalysis.investmentThesis}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                          <h4 className="font-bold text-emerald-500 mb-2 flex items-center gap-2">Bullish Factors</h4>
                          <p className="text-sm text-theme-secondary">{researchData.aiAnalysis.bullishFactors}</p>
                        </div>
                        <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                          <h4 className="font-bold text-rose-500 mb-2 flex items-center gap-2">Bearish Factors</h4>
                          <p className="text-sm text-theme-secondary">{researchData.aiAnalysis.bearishFactors}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                      <p className="text-theme-secondary">AI Analysis is currently processing data for this asset.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'news' && (
                <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Newspaper className="text-blue-500" /> Latest News</h3>
                  {researchData?.news && researchData.news.length > 0 ? (
                    <div className="space-y-4">
                      {researchData.news.map((item: any, idx: number) => (
                        <div key={idx} className="block p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition border border-slate-700 cursor-default">
                          <h4 className="font-bold text-blue-400 mb-2">{item.title}</h4>
                          <p className="text-sm text-theme-secondary mb-3">{item.summary}</p>
                          <div className="flex items-center gap-4 text-xs font-semibold text-theme-muted">
                            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                            <span>{item.source}</span>
                            <span className={`px-2 py-1 rounded-full ${item.impact === 'POSITIVE' ? 'bg-emerald-500/10 text-emerald-500' : item.impact === 'NEGATIVE' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-700 text-theme-secondary'}`}>{item.impact}</span>
                            {item.readTime && <span>{item.readTime} min read</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                      <p className="text-theme-secondary">No recent news available for this symbol.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><DollarSign className="text-emerald-500" /> Financial Reports</h3>
                  {researchData?.fundamentals?.financialHistory?.length > 0 ? (
                    <div className="space-y-8">
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <h4 className="text-lg font-bold mb-4 text-theme-primary">Revenue vs Net Income (Annual)</h4>
                        <div className="h-72">
                          <Bar 
                            data={{
                              labels: researchData.fundamentals.financialHistory.map((h: any) => h.date),
                              datasets: [
                                {
                                  label: 'Revenue',
                                  data: researchData.fundamentals.financialHistory.map((h: any) => h.revenue),
                                  backgroundColor: 'rgba(59, 130, 246, 0.7)',
                                },
                                {
                                  label: 'Net Income',
                                  data: researchData.fundamentals.financialHistory.map((h: any) => h.netIncome),
                                  backgroundColor: 'rgba(16, 185, 129, 0.7)',
                                }
                              ]
                            }} 
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: { position: 'top', labels: { color: '#cbd5e1' } }
                              },
                              scales: {
                                y: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } },
                                x: { grid: { color: '#334155' }, ticks: { color: '#cbd5e1' } }
                              }
                            }} 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {researchData.fundamentals.financialHistory.slice(-1).map((latest: any, idx: number) => (
                          <React.Fragment key={idx}>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                              <p className="text-sm text-theme-secondary">Latest Revenue ({latest.date})</p>
                              <p className="text-xl font-bold text-blue-400">₹{(latest.revenue / 10000000).toFixed(2)} Cr</p>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                              <p className="text-sm text-theme-secondary">Latest Net Income ({latest.date})</p>
                              <p className="text-xl font-bold text-emerald-400">₹{(latest.netIncome / 10000000).toFixed(2)} Cr</p>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                              <p className="text-sm text-theme-secondary">Latest Gross Profit ({latest.date})</p>
                              <p className="text-xl font-bold text-purple-400">₹{(latest.grossProfit / 10000000).toFixed(2)} Cr</p>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                      <p className="text-theme-secondary">Historical financial data is not available for this symbol.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Order Execution */}
        <div className="w-96 flex-shrink-0 border-l overflow-y-auto hidden lg:block" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
              Place Order
            </h2>
            
            {/* Order Form Implementation */}
            <div className="space-y-6">
              <div className="flex rounded-lg overflow-hidden border p-1" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-primary)' }}>
                <button 
                  onClick={() => setOrderType('buy')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${orderType === 'buy' ? 'bg-blue-600 text-white shadow-md' : ''}`}
                  style={{ color: orderType === 'buy' ? '' : 'var(--text-muted)' }}
                >
                  BUY
                </button>
                <button 
                  onClick={() => setOrderType('sell')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${orderType === 'sell' ? 'bg-rose-600 text-white shadow-md' : ''}`}
                  style={{ color: orderType === 'sell' ? '' : 'var(--text-muted)' }}
                >
                  SELL
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Order Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setOrderMode('market')} className={`px-4 py-2 text-sm font-semibold border rounded-lg ${orderMode === 'market' ? 'border-blue-500 bg-blue-500/10 text-blue-600' : ''}`} style={{ borderColor: orderMode === 'market' ? '' : 'var(--border-primary)' }}>Market</button>
                  <button onClick={() => setOrderMode('limit')} className={`px-4 py-2 text-sm font-semibold border rounded-lg ${orderMode === 'limit' ? 'border-blue-500 bg-blue-500/10 text-blue-600' : ''}`} style={{ borderColor: orderMode === 'limit' ? '' : 'var(--border-primary)' }}>Limit</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-4 py-2 text-lg font-mono border rounded-lg bg-transparent" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }} />
              </div>

              {orderMode === 'limit' && (
                <div>
                  <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Limit Price</label>
                  <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)} className="w-full px-4 py-2 text-lg font-mono border rounded-lg bg-transparent" placeholder={currentPrice.toString()} style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }} />
                </div>
              )}

              <button 
                onClick={handlePlaceOrder}
                disabled={isTrading || !brokerConnected}
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-2 ${
                  !brokerConnected ? 'bg-slate-400 cursor-not-allowed' : orderType === 'buy' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                }`}
              >
                {isTrading ? <Activity className="h-5 w-5 animate-spin" /> : <>{orderType === 'buy' ? 'Execute Buy' : 'Execute Sell'} Order</>}
              </button>

              {!brokerConnected && (
                <div className="text-center text-xs font-medium text-rose-500 flex items-center justify-center gap-1 mt-2">
                  <Lock className="w-3 h-3" /> Connect a broker to execute trades
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isBrokerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-4">Connect Broker</h3>
            <div className="space-y-3">
              {brokers.map(b => (
                <button key={b.id} onClick={() => handleConnectBroker(b.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${b.color} hover:shadow-lg`}>
                  <span className="font-bold">{b.name}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              ))}
            </div>
            <button onClick={() => setIsBrokerModalOpen(false)} className="w-full mt-6 py-3 font-semibold text-theme-muted hover:text-slate-700">Cancel</button>
          </div>
        </div>
      )}

      <CdslModal isOpen={isCdslOpen} onClose={() => setIsCdslOpen(false)} onSuccess={executeTrade} quantity={parseInt(quantity || '0', 10)} stockSymbol={displaySymbol} />
    </div>
  );
}
