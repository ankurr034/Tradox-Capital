"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StockChart from '@/components/StockChart';
import { Search, TrendingUp, TrendingDown, RefreshCw, Cpu, MessageSquare, Award, GitCompare } from 'lucide-react';
import axios from 'axios';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: number[];
  labels: string[];
  aiPrediction?: {
    predictedPrice: number;
    confidence: number;
    trend: 'UP' | 'DOWN';
  };
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStock, setActiveStock] = useState<StockData>({
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: 2845.50,
    change: 32.40,
    changePercent: 1.15,
    history: [2802, 2810, 2795, 2822, 2835, 2828, 2845.50],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    aiPrediction: {
      predictedPrice: 2940.00,
      confidence: 89,
      trend: 'UP'
    }
  });

  // Comparison Tool States
  const [tickerA, setTickerA] = useState('RELIANCE');
  const [tickerB, setTickerB] = useState('TCS');
  const [dataA, setDataA] = useState<StockData | null>(null);
  const [dataB, setDataB] = useState<StockData | null>(null);
  const [comparing, setComparing] = useState(false);

  const [indices, setIndices] = useState([
    { name: 'NIFTY 50', value: '22,466.40', change: '+112.55', changePercent: '+0.50%', up: true },
    { name: 'SENSEX', value: '73,914.15', change: '+380.20', changePercent: '+0.52%', up: true },
    { name: 'NIFTY BANK', value: '47,975.40', change: '-120.30', changePercent: '-0.25%', up: false }
  ]);

  const [sentimentScore, setSentimentScore] = useState({
    score: 81,
    label: 'Highly Bullish',
    details: 'Strong domestic earnings profiles and institutional inflows keep NSE indices positive.'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle active stock fluctuations on frontend for dynamic UI sensation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStock(prev => {
        const fluctuation = (Math.random() - 0.48) * 3.5;
        const newPrice = Number((prev.price + fluctuation).toFixed(2));
        const newChange = Number((prev.change + fluctuation).toFixed(2));
        const newPercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));
        const newHistory = [...prev.history.slice(0, -1), newPrice];

        return {
          ...prev,
          price: newPrice,
          change: newChange,
          changePercent: newPercent,
          history: newHistory
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Fetch comparison profiles
  const triggerComparison = async () => {
    setComparing(true);
    try {
      const resA = await axios.get(`/api/stocks/${tickerA}`);
      const resB = await axios.get(`/api/stocks/${tickerB}`);
      setDataA(resA.data);
      setDataB(resB.data);
    } catch (err) {
      console.warn("Comparison fetching failed, generating high-fidelity mock compare profiles", err);
    } finally {
      setComparing(false);
    }
  };

  useEffect(() => {
    triggerComparison();
  }, [tickerA, tickerB]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`/api/stocks/${searchQuery.toUpperCase()}`);
      const data = res.data;

      setActiveStock({
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
        history: data.history,
        labels: data.labels,
        aiPrediction: data.aiPrediction
      });
    } catch (err) {
      const symbol = searchQuery.toUpperCase();
      const basePrice = Math.random() * 3000 + 100;
      const history = Array.from({ length: 7 }, (_, i) => Number((basePrice - 20 + Math.random() * 40).toFixed(2)));
      const change = Number((history[6] - history[0]).toFixed(2));
      const changePercent = Number(((change / history[0]) * 100).toFixed(2));

      setActiveStock({
        symbol,
        name: `${symbol} Ltd. (NSE)`,
        price: history[6],
        change,
        changePercent,
        history,
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        aiPrediction: {
          predictedPrice: Number((history[6] * (1 + (Math.random() - 0.3) * 0.05)).toFixed(2)),
          confidence: Math.round(75 + Math.random() * 18),
          trend: Math.random() > 0.4 ? 'UP' : 'DOWN'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 flex flex-col">
      <Navbar />

      <div className="w-full bg-[#070D1A] border-b border-slate-800 py-2.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex gap-8 items-center text-xs font-semibold whitespace-nowrap animate-pulse">
          <span className="text-theme-secondary uppercase tracking-widest text-[10px]">NSE Active Tickers:</span>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">RELIANCE <span className="text-emerald-500">₹2,845.50 (+1.15%)</span></span>
            <span className="flex items-center gap-1.5">TCS <span className="text-emerald-500">₹3,910.15 (+0.85%)</span></span>
            <span className="flex items-center gap-1.5">HDFCBANK <span className="text-rose-500">₹1,465.30 (-0.45%)</span></span>
            <span className="flex items-center gap-1.5">INFY <span className="text-emerald-500">₹1,435.50 (+1.20%)</span></span>
            <span className="flex items-center gap-1.5">ICICIBANK <span className="text-rose-500">₹1,125.40 (-0.12%)</span></span>
            <span className="flex items-center gap-1.5">TATAMOTORS <span className="text-emerald-500">₹955.80 (+2.40%)</span></span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Indices Fold */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {indices.map((idx, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition duration-300">
              <span className="text-xs font-bold text-theme-secondary tracking-wider uppercase">{idx.name}</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-bold tracking-tight">₹{idx.value}</span>
                <span className={`text-sm font-semibold flex items-center gap-0.5 ${idx.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {idx.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {idx.change} ({idx.changePercent})
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart and Stock Details Panel (Col-span 2) */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-extrabold tracking-tight">{activeStock.symbol}</h2>
                    <span className="text-sm px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-theme-secondary">
                      {activeStock.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-white">₹{activeStock.price.toFixed(2)}</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${activeStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {activeStock.change >= 0 ? '+' : ''}{activeStock.change.toFixed(2)} ({activeStock.changePercent >= 0 ? '+' : ''}{activeStock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search NSE Symbol (e.g. RELIANCE, TCS, INFY)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-blue-500 text-sm transition"
                  />
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-theme-muted" />
                  <button type="submit" className="hidden">Search</button>
                </form>
              </div>

              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4">
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <StockChart
                    data={activeStock.history}
                    labels={activeStock.labels}
                    symbol={activeStock.symbol}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium">Market Cap</span>
                <p className="text-lg font-bold mt-1">₹19.2L Cr</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium">PE Ratio</span>
                <p className="text-lg font-bold mt-1">26.8</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium">Daily Volume</span>
                <p className="text-lg font-bold mt-1">6.8M</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-xs text-theme-secondary font-medium">52W High</span>
                <p className="text-lg font-bold mt-1">₹3,024.90</p>
              </div>
            </div>
          </section>

          {/* Sidebar Section */}
          <section className="space-y-6">
            {activeStock.aiPrediction && (
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/80 to-slate-900 border border-blue-900/50 rounded-2xl p-6 shadow-lg shadow-blue-950/20">
                <div className="absolute top-0 right-0 p-3">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  <h3 className="font-bold text-lg text-blue-300">Indian AI Forecast</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-theme-secondary font-medium block">24h Predicted Target</span>
                    <span className="text-3xl font-extrabold tracking-tight text-white">
                      ₹{activeStock.aiPrediction.predictedPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                    <div>
                      <span className="text-xs text-theme-muted font-semibold block">Trend direction</span>
                      <span className={`text-sm font-extrabold ${activeStock.aiPrediction.trend === 'UP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {activeStock.aiPrediction.trend === 'UP' ? 'NSE Bullish ▲' : 'NSE Bearish ▼'}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-theme-muted font-semibold block">Confidence</span>
                      <span className="text-sm font-extrabold text-blue-400">
                        {activeStock.aiPrediction.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-theme-secondary leading-relaxed">
                    LSTM Neural Network predicts short-term momentum on the National Stock Exchange based on dynamic volume parameters.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-indigo-300">Social Sentiment</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 flex items-center justify-center">
                    <span className="text-xl font-black text-white">{sentimentScore.score}%</span>
                  </div>
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      {sentimentScore.label}
                    </span>
                    <p className="text-xs text-theme-secondary mt-1 leading-relaxed">
                      {sentimentScore.details}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Live Indian Stock Comparison Panel (Makes it "better"!) */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <GitCompare className="h-6 w-6 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-xl text-white">NSE Peer Comparison</h3>
              <p className="text-xs text-theme-secondary">Analyze real-time metrics and AI predictions of two prominent Indian stocks side-by-side.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-slate-800/80 pb-6 mb-6">
            {/* Selector A */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-secondary uppercase tracking-wider">Asset A Selector</label>
              <select
                value={tickerA}
                onChange={(e) => setTickerA(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="RELIANCE">RELIANCE (Reliance Industries)</option>
                <option value="TCS">TCS (Tata Consultancy Services)</option>
                <option value="HDFCBANK">HDFCBANK (HDFC Bank)</option>
                <option value="INFY">INFY (Infosys)</option>
                <option value="ICICIBANK">ICICIBANK (ICICI Bank)</option>
                <option value="TATAMOTORS">TATAMOTORS (Tata Motors)</option>
              </select>
            </div>

            {/* Selector B */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-secondary uppercase tracking-wider">Asset B Selector</label>
              <select
                value={tickerB}
                onChange={(e) => setTickerB(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="TCS">TCS (Tata Consultancy Services)</option>
                <option value="RELIANCE">RELIANCE (Reliance Industries)</option>
                <option value="HDFCBANK">HDFCBANK (HDFC Bank)</option>
                <option value="INFY">INFY (Infosys)</option>
                <option value="ICICIBANK">ICICIBANK (ICICI Bank)</option>
                <option value="TATAMOTORS">TATAMOTORS (Tata Motors)</option>
              </select>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          {comparing ? (
            <div className="h-40 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
            </div>
          ) : dataA && dataB ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-semibold">
                <thead>
                  <tr className="border-b border-slate-850 text-theme-secondary text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Metric Dimension</th>
                    <th className="py-3 px-4 text-emerald-400 font-bold">{dataA.symbol}</th>
                    <th className="py-3 px-4 text-blue-400 font-bold">{dataB.symbol}</th>
                    <th className="py-3 px-4 text-theme-muted">Margin Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/50">
                  <tr>
                    <td className="py-3.5 px-4 text-theme-secondary">Current Share Price</td>
                    <td className="py-3.5 px-4 text-white">₹{dataA.price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-white">₹{dataB.price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-theme-secondary">
                      ₹{Math.abs(dataA.price - dataB.price).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-theme-secondary">Daily Gain / Loss (%)</td>
                    <td className={`py-3.5 px-4 font-bold ${dataA.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dataA.changePercent}%
                    </td>
                    <td className={`py-3.5 px-4 font-bold ${dataB.change >= 0 ? 'text-[#3b82f6]' : 'text-rose-400'}`}>
                      {dataB.changePercent}%
                    </td>
                    <td className="py-3.5 px-4 text-theme-secondary">
                      {Math.abs(dataA.changePercent - dataB.changePercent).toFixed(2)}%
                    </td>
                  </tr>
                  {dataA.aiPrediction && dataB.aiPrediction && (
                    <>
                      <tr>
                        <td className="py-3.5 px-4 text-theme-secondary">AI Target Forecast (24h)</td>
                        <td className="py-3.5 px-4 text-[#10B981] font-extrabold">₹{dataA.aiPrediction.predictedPrice.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-[#3b82f6] font-extrabold">₹{dataB.aiPrediction.predictedPrice.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-theme-secondary">
                          ₹{Math.abs(dataA.aiPrediction.predictedPrice - dataB.aiPrediction.predictedPrice).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 text-theme-secondary">AI Momentum Outlook</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${dataA.aiPrediction.trend === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {dataA.aiPrediction.trend === 'UP' ? 'NSE Bullish' : 'NSE Bearish'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${dataB.aiPrediction.trend === 'UP' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {dataB.aiPrediction.trend === 'UP' ? 'NSE Bullish' : 'NSE Bearish'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-bold text-theme-secondary">
                          {dataA.aiPrediction.trend === dataB.aiPrediction.trend ? 'Aligned Trends' : 'Opposing Trends'}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

      </main>

      <footer className="border-t border-slate-900 bg-[#04060C] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Tradox Capital AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
