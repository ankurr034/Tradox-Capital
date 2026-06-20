"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Target } from 'lucide-react';

export default function Retirement() {
  const [funds, setFunds] = useState([]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Green Hero Banner */}
        <div className="bg-[#10b981] rounded-2xl p-8 md:p-10 text-white shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md flex-shrink-0">
            <Target className="h-8 w-8 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Retirement Plan</h1>
            <p className="text-emerald-50 font-medium">Plan your retirement with systematic withdrawal plans and yearly return calculations</p>
          </div>
        </div>

        {/* Step 1: Select Your Funds */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Step 1: Select Your Funds</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Search and add mutual funds to build your retirement portfolio. You can add 1-5 funds.</p>
          
          <div className="relative max-w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search mutual funds by name..." 
              className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-16 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
            <Target className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Select Funds to Get Started</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md">
            Add at least 1 fund to your portfolio above to begin planning your retirement strategy.
          </p>
        </div>

      </main>
    </div>
  );
}
