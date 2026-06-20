"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Sparkles, BrainCircuit, Activity, TrendingUp, Cpu, Radar, Target, Lock, ChevronRight, Zap } from 'lucide-react';

export default function AIAnalysisPage() {
  const [activeModel, setActiveModel] = useState('nifty');

  const models = [
    { id: 'nifty', name: 'NIFTY 50 Predictor', accuracy: '94.2%', status: 'BULLISH', target: '24,150', timeHorizon: '1W' },
    { id: 'bank', name: 'Bank Nifty Alpha', accuracy: '91.8%', status: 'NEUTRAL', target: '50,100', timeHorizon: '1W' },
    { id: 'it', name: 'IT Sector Rotation', accuracy: '88.5%', status: 'BEARISH', target: '35,400', timeHorizon: '1M' },
  ];

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary font-sans selection:bg-violet-500/30 overflow-hidden transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-bold tracking-wide uppercase mb-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
            <Sparkles className="h-4 w-4" /> Kautilya AI Engine Active
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-violet-600 to-violet-800 dark:from-white dark:via-violet-200 dark:to-violet-400 mb-6 tracking-tight">
            Predictive Market Intelligence
          </h1>
          <p className="text-lg text-theme-muted max-w-2xl mx-auto leading-relaxed">
            Harness the power of institutional-grade machine learning. Our proprietary neural networks process billions of data points daily to forecast market movements with unprecedented precision.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Models List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-theme-primary mb-4 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-violet-500 dark:text-violet-400" /> Active Models
            </h3>
            {models.map(model => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                  activeModel === model.id 
                  ? 'bg-violet-500/10 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                  : 'bg-theme-surface border-theme hover:border-theme-secondary hover:bg-theme-elevated'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-theme-primary text-lg">{model.name}</h4>
                  <span className="text-xs font-black px-2 py-1 bg-theme-elevated text-theme-secondary rounded-md">
                    {model.timeHorizon}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm mt-4">
                  <div className="flex items-center gap-1.5 text-theme-muted">
                    <Target className="h-4 w-4" /> Acc: <span className="text-theme-primary font-bold">{model.accuracy}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-theme-muted">
                    <Activity className="h-4 w-4" /> 
                    Status: 
                    <span className={`font-black ${model.status === 'BULLISH' ? 'text-emerald-500 dark:text-emerald-400' : model.status === 'BEARISH' ? 'text-rose-500 dark:text-rose-400' : 'text-amber-500 dark:text-amber-400'}`}>
                      {model.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}

            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-indigo-100 to-slate-100 dark:from-indigo-900/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mb-3" />
              <h4 className="font-bold text-theme-primary mb-2">Unlock Enterprise Models</h4>
              <p className="text-sm text-theme-muted mb-4">Get access to high-frequency trading signals and crypto predictions.</p>
              <button className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white transition-colors">
                Upgrade to Pro <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Model Details */}
          <div className="lg:col-span-2">
            <div className="bg-theme-card backdrop-blur-xl border border-theme rounded-3xl p-8 h-full relative overflow-hidden shadow-xl">
              {/* Grid Background Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-theme">
                  <div>
                    <h2 className="text-3xl font-black text-theme-primary mb-2">
                      {models.find(m => m.id === activeModel)?.name} Analysis
                    </h2>
                    <p className="text-theme-muted font-medium">Real-time deep learning inference</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-theme-muted mb-1">Target Prediction</div>
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-200">
                      {models.find(m => m.id === activeModel)?.target}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Data Points */}
                  <div className="bg-theme-surface border border-theme rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-theme-muted mb-4 flex items-center gap-2 uppercase tracking-wider">
                      <Cpu className="h-4 w-4" /> System Variables
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">VIX Volatility Index</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">13.4 (-1.2%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">FII Net Flow (24h)</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+₹1,240 Cr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-theme-secondary">Sentiment Score</span>
                        <span className="font-mono text-theme-primary font-bold border border-theme px-2 py-0.5 rounded bg-theme-elevated">78/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Neural Graph Mock */}
                  <div className="bg-theme-surface border border-theme rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <Radar className="h-16 w-16 text-violet-500/50 mb-4 animate-[spin_10s_linear_infinite]" />
                    <h4 className="font-bold text-theme-primary mb-1">Neural Topology Mapping</h4>
                    <p className="text-xs text-theme-muted">Processing 1.2M macro data points...</p>
                    
                    {/* Fake progress bar */}
                    <div className="w-full h-1.5 bg-theme-elevated rounded-full mt-4 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 w-full animate-[pulse_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>

                {/* AI Commentary */}
                <div className="bg-violet-100 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-500/20 rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Zap className="h-4 w-4 text-violet-600 dark:text-violet-400" /> Executive Summary
                  </h4>
                  <p className="text-theme-secondary leading-relaxed font-medium">
                    The {models.find(m => m.id === activeModel)?.name} model indicates a strong convergence of bullish indicators, primarily driven by robust institutional inflows and stabilizing bond yields. 
                    Downside risk is currently modeled at a historic low of 14.2% for the coming trading week. Resistance breakouts are anticipated within the next 3 trading sessions.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
