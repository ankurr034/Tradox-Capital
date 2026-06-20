"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import { 
  Search, ArrowLeft, TrendingUp, TrendingDown, ChevronRight, ChevronLeft, Activity
} from 'lucide-react';
import allIndicesData from '@/data/all_indices.json';

const PAGE_SIZE = 50;

export default function AnalysisPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Data states
  const [selectedIndexId, setSelectedIndexId] = useState(allIndicesData.metadata[0].id);
  const [livePrices, setLivePrices] = useState<Record<string, any>>({});
  const [indexQuotes, setIndexQuotes] = useState<Record<string, any>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => setMounted(true), []);

  const selectedIndexMetadata = allIndicesData.metadata.find(i => i.id === selectedIndexId);
  const rawConstituents = (allIndicesData.constituents as any)[selectedIndexId] || [];

  // Filter constituents by search
  const filteredConstituents = useMemo(() => {
    if (!searchQuery.trim()) return rawConstituents;
    const lowerQuery = searchQuery.toLowerCase();
    return rawConstituents.filter((c: any) => 
      c.company.toLowerCase().includes(lowerQuery) || 
      c.symbol.toLowerCase().includes(lowerQuery) ||
      c.sector.toLowerCase().includes(lowerQuery)
    );
  }, [rawConstituents, searchQuery]);

  const totalPages = Math.ceil(filteredConstituents.length / PAGE_SIZE);
  const currentConstituents = filteredConstituents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Fetch Index level data
  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const res = await fetch('/api/indices');
        if (res.ok) {
          const data = await res.json();
          setIndexQuotes(data);
        }
      } catch (err) {
        console.error("Failed to fetch index quotes", err);
      }
    };
    
    fetchIndices();
    const interval = setInterval(fetchIndices, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch batch quotes for visible constituents
  useEffect(() => {
    if (currentConstituents.length === 0) return;
    let isSubscribed = true;

    const fetchBatchPrices = async () => {
      try {
        setIsLoadingPrices(true);
        const symbols = currentConstituents.map((c: any) => c.symbol).join(',');
        const res = await fetch(`/api/batch-quotes?symbols=${encodeURIComponent(symbols)}`);
        if (res.ok && isSubscribed) {
          const data = await res.json();
          setLivePrices(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Failed to fetch batch prices", err);
      } finally {
        if (isSubscribed) setIsLoadingPrices(false);
      }
    };

    fetchBatchPrices();
    const interval = setInterval(fetchBatchPrices, 5000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [currentConstituents]);

  // Reset page on index change or search
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedIndexId, searchQuery]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar />

      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden pt-16">

        {/* Left Sidebar: Indices List */}
        <div className="w-full lg:w-80 lg:flex-shrink-0 border-b lg:border-r flex flex-col bg-opacity-50" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
          <div className="p-5 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-3 mb-4 text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
              <Link href="/" className="hover:text-blue-500 transition-colors flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Home
              </Link>
              <span style={{ color: 'var(--border-primary)' }}>/</span>
              <span>Market Analysis</span>
            </div>
            <h2 className="text-xl font-black mb-1">Major Indices</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Real-time updates across all NSE indices</p>
          </div>

          <div className="lg:flex-1 max-h-[40vh] lg:max-h-none overflow-y-auto no-scrollbar p-3 space-y-2">
            {allIndicesData.metadata.map((idx) => {
              const isSelected = selectedIndexId === idx.id;
              const idxData = indexQuotes[idx.id];
              const isPositive = idxData?.changePercent >= 0;

              return (
                <button
                  key={idx.id}
                  onClick={() => setSelectedIndexId(idx.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
                      : 'border-transparent hover:border-[var(--border-primary)]'
                  }`}
                  style={{ 
                    backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold ${isSelected ? 'text-blue-500' : ''}`} style={{ color: isSelected ? '' : 'var(--text-primary)' }}>
                        {idx.name}
                      </h3>
                      <div className="text-[10px] uppercase font-bold tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {idx.constituents}
                      </div>
                    </div>
                    {idxData && (
                      <div className={`text-right ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <div className="font-bold flex items-center justify-end gap-1">
                          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {idxData.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-semibold mt-0.5">
                          {isPositive ? '+' : ''}{idxData.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    )}
                    {!idxData && (
                      <div className="text-right">
                        <div className="h-4 w-16 bg-slate-500/10 animate-pulse rounded"></div>
                      </div>
                    )}
                  </div>
                  
                  {idxData && (
                    <div className="flex justify-between items-center text-[10px] font-semibold pt-2 mt-2 border-t" style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}>
                      <span>H: {idxData.dayHigh.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      <span>L: {idxData.dayLow.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content: Constituents Table */}
        <div className="flex-1 flex flex-col bg-opacity-30" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Header */}
          <div className="p-6 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}>
            <div>
              <h1 className="text-2xl font-black mb-1 flex items-center gap-3">
                {selectedIndexMetadata?.name} Constituents
                {isLoadingPrices && <Activity className="h-5 w-5 text-blue-500 animate-pulse" />}
              </h1>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                {selectedIndexMetadata?.desc} • {filteredConstituents.length} Results
              </p>
            </div>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search stocks by name, symbol, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none font-semibold text-sm transition-shadow focus:shadow-md"
                style={{ 
                  backgroundColor: 'var(--bg-input)', 
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto no-scrollbar relative p-6">
            <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider font-black border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                      <th className="p-4 whitespace-nowrap">Company</th>
                      <th className="p-4 whitespace-nowrap text-right">LTP (₹)</th>
                      <th className="p-4 whitespace-nowrap text-right">Prev Close</th>
                      <th className="p-4 whitespace-nowrap text-right">Day Chg</th>
                      <th className="p-4 whitespace-nowrap text-right">Chg %</th>
                      <th className="p-4 whitespace-nowrap text-right">Volume</th>
                      <th className="p-4 whitespace-nowrap text-right">Market Cap</th>
                      <th className="p-4 whitespace-nowrap text-right">52W High</th>
                      <th className="p-4 whitespace-nowrap text-right">52W Low</th>
                      <th className="p-4 whitespace-nowrap">Sector</th>
                      <th className="p-4 whitespace-nowrap text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                    {currentConstituents.map((stock: any) => {
                      const quote = livePrices[stock.symbol];
                      const isPositive = quote?.changePercent >= 0;
                      
                      const formatNum = (num: number) => num ? num.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '-';
                      const formatLargeNum = (num: number) => {
                        if (!num) return '-';
                        if (num >= 1e7) return `₹${(num / 1e7).toFixed(2)} Cr`;
                        if (num >= 1e5) return `₹${(num / 1e5).toFixed(2)} L`;
                        return num.toLocaleString('en-IN');
                      };

                      return (
                        <tr key={stock.symbol} className="hover:bg-blue-500/5 transition-colors group cursor-pointer">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg flex items-center justify-center font-black text-sm shadow-sm" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-primary)' }}>
                                {stock.symbol.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</div>
                                <div className="text-xs truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{stock.company}</div>
                              </div>
                            </div>
                          </td>
                          
                          <td className="p-4 text-right font-black" style={{ color: 'var(--text-primary)' }}>
                            {quote ? `₹${formatNum(quote.price)}` : <div className="h-4 w-16 bg-slate-500/10 animate-pulse rounded ml-auto"></div>}
                          </td>
                          
                          <td className="p-4 text-right text-xs" style={{ color: 'var(--text-muted)' }}>
                            {quote ? `₹${formatNum(quote.prevClose)}` : '-'}
                          </td>
                          
                          <td className={`p-4 text-right font-bold ${quote ? (isPositive ? 'text-emerald-500' : 'text-rose-500') : ''}`}>
                            {quote ? `${isPositive ? '+' : ''}${formatNum(quote.change)}` : '-'}
                          </td>
                          
                          <td className="p-4 text-right">
                            {quote ? (
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-black ${
                                isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                              }`}>
                                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                              </div>
                            ) : '-'}
                          </td>

                          <td className="p-4 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {quote ? formatLargeNum(quote.volume) : '-'}
                          </td>

                          <td className="p-4 text-right text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            {quote ? formatLargeNum(quote.marketCap) : '-'}
                          </td>

                          <td className="p-4 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {quote ? `₹${formatNum(quote.fiftyTwoHigh)}` : '-'}
                          </td>

                          <td className="p-4 text-right text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {quote ? `₹${formatNum(quote.fiftyTwoLow)}` : '-'}
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-primary)' }}>
                              {stock.sector}
                            </span>
                          </td>
                          
                          <td className="p-4 text-center">
                            <Link 
                              href={`/stocks/${stock.exchange}:${stock.symbol}`}
                              className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                    {currentConstituents.length === 0 && (
                      <tr>
                        <td colSpan={11} className="p-10 text-center text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                          No stocks found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between p-4 rounded-xl border shadow-sm" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Showing <strong style={{ color: 'var(--text-primary)' }}>{((currentPage - 1) * PAGE_SIZE) + 1}</strong> to <strong style={{ color: 'var(--text-primary)' }}>{Math.min(currentPage * PAGE_SIZE, filteredConstituents.length)}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{filteredConstituents.length}</strong> entries
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold border transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-elevated)' }}
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold border transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-elevated)' }}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
