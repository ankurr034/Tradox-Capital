"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, TrendingUp, Trash2, Calculator, IndianRupee, PieChart, Plus, Loader2 } from 'lucide-react';

type Fund = {
  id: string;
  name: string;
  code: string;
  category: string;
  launchDate: string;
  weightage: number;
};

export default function Investment() {
  const [funds, setFunds] = useState<Fund[]>([
    {
      id: 'hdfc-bal',
      name: 'HDFC Balanced Advantage Fund - Growth Plan',
      code: '100119',
      category: 'Hybrid Scheme - Dynamic Asset Allocation',
      launchDate: 'Apr 3, 2006',
      weightage: 50
    },
    {
      id: 'icici-blue',
      name: 'ICICI Prudential Bluechip Fund - Growth',
      code: '111360',
      category: 'Equity Scheme - Large Cap Fund',
      launchDate: 'May 23, 2008',
      weightage: 30
    },
    {
      id: 'sbi-small',
      name: 'SBI Small Cap Fund - Regular Plan',
      code: '111956',
      category: 'Equity Scheme - Small Cap Fund',
      launchDate: 'Sep 9, 2009',
      weightage: 20
    }
  ]);

  // Search State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Calculator State
  const [strategy, setStrategy] = useState<'sip' | 'lumpsum'>('sip');
  const [amount, setAmount] = useState<number>(10000);
  const [years, setYears] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12); // Default 12%
  const [calcResult, setCalcResult] = useState<{ invested: number, futureValue: number, gained: number } | null>(null);

  const totalWeightage = funds.reduce((sum, f) => sum + f.weightage, 0);

  // Debounced Search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setShowDropdown(true);
        }
      } catch (e) {
        console.error('Search failed', e);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleAddFund = (item: any) => {
    if (funds.length >= 5) return alert('Maximum 5 funds allowed.');
    if (funds.find(f => f.code === item.symbol)) return alert('Fund already added.');

    const newFund: Fund = {
      id: item.symbol,
      name: item.company || item.symbol,
      code: item.symbol,
      category: item.sector || 'Equity Scheme',
      launchDate: 'N/A',
      weightage: 0
    };

    const newFunds = [...funds, newFund];
    // Auto balance weightages equally
    const equalWeight = Math.floor(100 / newFunds.length);
    let remainder = 100 - (equalWeight * newFunds.length);
    
    newFunds.forEach((f, i) => {
      f.weightage = equalWeight + (i < remainder ? 1 : 0);
    });

    setFunds(newFunds);
    setQuery('');
    setShowDropdown(false);
  };

  const handleRemoveFund = (id: string) => {
    const newFunds = funds.filter(f => f.id !== id);
    if (newFunds.length > 0) {
      const equalWeight = Math.floor(100 / newFunds.length);
      let remainder = 100 - (equalWeight * newFunds.length);
      newFunds.forEach((f, i) => {
        f.weightage = equalWeight + (i < remainder ? 1 : 0);
      });
    }
    setFunds(newFunds);
  };

  const handleWeightageChange = (id: string, val: string) => {
    const num = parseInt(val) || 0;
    setFunds(funds.map(f => f.id === id ? { ...f, weightage: num } : f));
  };

  const calculateReturns = () => {
    if (totalWeightage !== 100) {
      alert("Total weightage must be exactly 100% to calculate returns.");
      return;
    }

    const r = expectedReturn / 100;
    let invested = 0;
    let futureValue = 0;

    if (strategy === 'lumpsum') {
      invested = amount;
      futureValue = amount * Math.pow(1 + r, years);
    } else {
      invested = amount * 12 * years;
      const i = r / 12;
      const n = years * 12;
      futureValue = amount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    }

    setCalcResult({
      invested: Math.round(invested),
      futureValue: Math.round(futureValue),
      gained: Math.round(futureValue - invested)
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Purple Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 md:p-10 text-white shadow-lg flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight">Investment Plan</h1>
            <p className="text-blue-100 font-medium text-sm md:text-base">Calculate returns for SIP, Lumpsum, and combined investment strategies</p>
          </div>
        </div>

        {/* Step 1: Select Your Funds */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm relative z-20">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">Step 1: Select Your Funds</h2>
          <p className="text-sm md:text-base text-theme-muted dark:text-theme-secondary font-medium mb-6">Search and add mutual funds or stocks to build your portfolio. You can add up to 5 assets.</p>
          
          <div className="relative max-w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-theme-secondary" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
              placeholder="Search mutual funds by name..." 
              className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow text-slate-900 dark:text-slate-100 font-medium text-sm md:text-base"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            )}
            
            {/* Search Dropdown */}
            {showDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                {results.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleAddFund(item)}
                    className="p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.company}</div>
                      <div className="text-xs text-theme-muted">{item.symbol} &bull; {item.sector}</div>
                    </div>
                    <Plus className="w-5 h-5 text-blue-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fund Bucket */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Fund Bucket</h3>
              <p className="text-sm text-theme-muted dark:text-theme-secondary font-medium">Manage your selected funds <span className="text-blue-600 dark:text-blue-400 font-bold">({funds.length}/5 funds)</span></p>
            </div>
            <div className={`text-sm font-medium flex items-center px-4 py-2 rounded-lg border ${totalWeightage === 100 ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400'}`}>
              Weightage <span className="text-xl font-black ml-2">{totalWeightage}%</span>
            </div>
          </div>

          {funds.length === 0 ? (
            <div className="text-center py-10 text-theme-secondary font-medium border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No funds added yet. Search and add funds above.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-4 text-sm font-bold text-theme-muted dark:text-theme-secondary w-1/3">Fund Name</th>
                    <th className="pb-4 text-sm font-bold text-theme-muted dark:text-theme-secondary w-1/4">Category</th>
                    <th className="pb-4 text-sm font-bold text-theme-muted dark:text-theme-secondary w-1/6">Launch Date</th>
                    <th className="pb-4 text-sm font-bold text-theme-muted dark:text-theme-secondary w-24">Weightage (%)</th>
                    <th className="pb-4 text-sm font-bold text-theme-muted dark:text-theme-secondary w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {funds.map((fund) => (
                    <tr key={fund.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-5 pr-4">
                        <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight mb-1">{fund.name}</div>
                        <div className="text-xs text-theme-secondary font-medium">Code: {fund.code}</div>
                      </td>
                      <td className="py-5 pr-4">
                        <span className="inline-flex px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-theme-secondary rounded-lg text-[11px] font-bold leading-tight border border-slate-200 dark:border-slate-700 text-center">
                          {fund.category}
                        </span>
                      </td>
                      <td className="py-5 text-sm font-medium text-slate-600 dark:text-theme-secondary pr-4">
                        {fund.launchDate}
                      </td>
                      <td className="py-5">
                        <input 
                          type="number" 
                          value={fund.weightage}
                          onChange={(e) => handleWeightageChange(fund.id, e.target.value)}
                          className="w-20 text-center py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 font-bold text-sm text-slate-900 dark:text-white shadow-inner focus:ring-2 focus:ring-blue-500/50 outline-none"
                        />
                      </td>
                      <td className="py-5 text-center">
                        <button onClick={() => handleRemoveFund(fund.id)} className="p-2 text-theme-secondary hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Step 2: Calculate Returns */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">Step 2: Calculate Investment Returns</h2>
          <p className="text-sm md:text-base text-theme-muted dark:text-theme-secondary font-medium mb-8">Select an investment strategy and calculate your expected returns.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Input Form */}
            <div className="space-y-6">
              {/* Strategy Selector */}
              <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl flex gap-1 border border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setStrategy('sip')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${strategy === 'sip' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-theme-muted hover:text-slate-700 dark:hover:text-theme-secondary'}`}
                >
                  Monthly SIP
                </button>
                <button 
                  onClick={() => setStrategy('lumpsum')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${strategy === 'lumpsum' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-theme-muted hover:text-slate-700 dark:hover:text-theme-secondary'}`}
                >
                  One-time Lumpsum
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-theme-secondary mb-2">
                  {strategy === 'sip' ? 'Monthly Investment Amount' : 'Total Investment Amount'}
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-theme-secondary" />
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
              </div>

              {/* Years & Return Rate grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-theme-secondary mb-2">Time Horizon (Years)</label>
                  <input 
                    type="number" 
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-theme-secondary mb-2">Expected Return (%)</label>
                  <input 
                    type="number" 
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-slate-100 font-bold"
                  />
                </div>
              </div>

              <button 
                onClick={calculateReturns}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/30"
              >
                <Calculator className="w-5 h-5" /> Calculate Future Value
              </button>
            </div>

            {/* Results Display */}
            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
              {calcResult ? (
                <div className="space-y-6">
                  <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-bold text-theme-muted dark:text-theme-secondary uppercase tracking-wider mb-2">Expected Future Value</p>
                    <h3 className="text-4xl md:text-5xl font-black text-blue-600 dark:text-blue-500 tracking-tight">
                      {formatCurrency(calcResult.futureValue)}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold text-theme-muted dark:text-theme-secondary uppercase mb-1">Total Invested</p>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(calcResult.invested)}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                      <p className="text-xs font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase mb-1">Wealth Gained</p>
                      <p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(calcResult.gained)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex items-center gap-3 text-sm font-medium text-theme-muted dark:text-theme-secondary bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <PieChart className="w-5 h-5 text-blue-500 shrink-0" />
                    <p>Based on a portfolio of <strong className="text-slate-900 dark:text-white">{funds.length} assets</strong> with {expectedReturn}% expected annual return.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to Calculate</h3>
                  <p className="text-theme-muted dark:text-theme-secondary font-medium max-w-xs mx-auto">Fill in your investment details on the left and hit calculate to project your wealth.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
