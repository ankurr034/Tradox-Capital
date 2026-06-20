"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Search, TrendingUp, Trash2 } from 'lucide-react';

export default function Investment() {
  const [funds, setFunds] = useState([
    {
      id: 'hdfc-bal',
      name: 'HDFC Balanced Advantage Fund - Growth Plan',
      code: '100119',
      category: 'Hybrid Scheme - Dynamic Asset Allocation Or Balanced Advantage',
      launchDate: 'Apr 3, 2006',
      weightage: 100
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 pb-20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Purple Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-10 text-white shadow-lg flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Investment Plan</h1>
            <p className="text-blue-100 font-medium">Calculate returns for SIP, Lumpsum, and combined investment strategies</p>
          </div>
        </div>

        {/* Step 1: Select Your Funds */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Step 1: Select Your Funds</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">Search and add mutual funds to build your investment portfolio. You can add 1-5 funds.</p>
          
          <div className="relative max-w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search mutual funds by name..." 
              className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>
        </div>

        {/* Fund Bucket */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Fund Bucket</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Manage your selected funds and weightage allocation <span className="text-blue-600 dark:text-blue-400 font-bold">(1/5 funds)</span></p>
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Weightage <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 ml-2">100%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="pb-4 text-sm font-bold text-slate-500 dark:text-slate-400 w-1/3">Fund Name</th>
                  <th className="pb-4 text-sm font-bold text-slate-500 dark:text-slate-400 w-1/3">Category</th>
                  <th className="pb-4 text-sm font-bold text-slate-500 dark:text-slate-400 w-1/6">Launch Date</th>
                  <th className="pb-4 text-sm font-bold text-slate-500 dark:text-slate-400 w-24">Weightage (%)</th>
                  <th className="pb-4 text-sm font-bold text-slate-500 dark:text-slate-400 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund) => (
                  <tr key={fund.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-5 pr-4">
                      <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight mb-1">{fund.name}</div>
                      <div className="text-xs text-slate-400 font-medium">Code: {fund.code}</div>
                    </td>
                    <td className="py-5 pr-4">
                      <span className="inline-flex px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-[11px] font-bold leading-tight border border-slate-200 dark:border-slate-700">
                        {fund.category}
                      </span>
                    </td>
                    <td className="py-5 text-sm font-medium text-slate-600 dark:text-slate-400 pr-4">
                      {fund.launchDate}
                    </td>
                    <td className="py-5">
                      <input 
                        type="number" 
                        value={fund.weightage}
                        readOnly
                        className="w-20 text-center py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 font-bold text-sm text-slate-900 dark:text-white"
                      />
                    </td>
                    <td className="py-5 text-center">
                      <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 2: Calculate Returns */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Step 2: Calculate Investment Returns</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Select an investment strategy and calculate your expected returns based on historical NAV data.</p>
        </div>

      </main>
    </div>
  );
}
