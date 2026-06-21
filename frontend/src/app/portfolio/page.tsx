import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Sparkles, Terminal, Activity, Crosshair, Clock, History, Search } from 'lucide-react';
import Link from 'next/link';
import AllocationChart from './AllocationChart';
import ForecastChart from './ForecastChart';

import Navbar from '@/components/Navbar';

import { getBatchQuotes } from '@/lib/quotes';

// Helper to fetch live quotes directly using Yahoo Finance without HTTP recursion
async function getLiveQuotes(symbols: string[]) {
  if (symbols.length === 0) return {};
  try {
    return await getBatchQuotes(symbols);
  } catch (e) {
    return {};
  }
}

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/login');
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      portfolio: {
        include: {
          holdings: true,
          transactions: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
          orders: {
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
          },
          modelPortfolio: true
        }
      }
    }
  });

  if (!clientProfile || !clientProfile.portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-6 text-center text-theme-secondary font-mono">
        <div>
          <h1 className="text-xl font-bold mb-2">ERR: PORTFOLIO_NOT_FOUND</h1>
          <p className="text-xs text-theme-muted mb-6">Account provisioning incomplete.</p>
          <Link href="/" className="text-[#00E676] hover:underline">[ RETURN_HOME ]</Link>
        </div>
      </div>
    );
  }

  const portfolio = clientProfile.portfolio;
  const holdings = portfolio.holdings;
  const kycStatus = clientProfile.kycStatus;
  
  // Fetch live prices
  const symbols = holdings.map(h => h.symbol);
  const liveQuotes = await getLiveQuotes(symbols);

  let currentHoldingsValue = 0;
  let totalInvested = portfolio.usedFunds;

  const enrichedHoldings = holdings.map(h => {
    const quote = liveQuotes[h.symbol];
    const currentPrice = quote?.price || h.averagePrice; 
    const currentValue = currentPrice * h.quantity;
    const pnl = currentValue - h.investedValue;
    const pnlPercent = (pnl / h.investedValue) * 100;
    
    currentHoldingsValue += currentValue;
    
    return {
      ...h,
      currentPrice,
      currentValue,
      pnl,
      pnlPercent,
      dayChangePercent: quote?.changePercent || 0,
      dayChangeValue: quote?.change ? (quote.change * h.quantity) : 0,
    };
  });

  const totalPortfolioValue = portfolio.availableFunds + currentHoldingsValue;
  const totalPnl = currentHoldingsValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;
  
  let aiSentiment = "NEUTRAL";
  let aiForecast = "MARKET STABLE. MAINTAIN CURRENT POSITIONS. NO IMMEDIATE ACTION REQUIRED.";
  
  if (totalPnlPercent > 5) {
    aiSentiment = "STRONG_BULL";
    aiForecast = "MOMENTUM DETECTED. HOLD CORE POSITIONS. CONSIDER TRAILING STOPS TO PROTECT GAINS.";
  } else if (totalPnlPercent < -2) {
    aiSentiment = "BEARISH";
    aiForecast = "ELEVATED VOLATILITY. DOWNSIDE RISK PRESENT. PREPARE HEDGING STRATEGY.";
  } else if (totalPnlPercent > 0) {
    aiSentiment = "BULLISH";
    aiForecast = "SLIGHT UPWARD BIAS. MONITOR KEY RESISTANCE LEVELS.";
  }
  
  const pnlClass = totalPnl >= 0 ? "text-[#00E676]" : "text-[#FF3D00]";

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary font-sans pb-20 transition-colors duration-300">
      <Navbar />
      
      {/* KYC Warning Banner */}
      {kycStatus !== 'APPROVED' && (
        <div className="bg-[var(--danger)] text-white px-4 py-3 text-sm flex justify-center items-center z-30 relative font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">⚠</span> 
            {kycStatus === 'PENDING' ? 'Action Required: Complete your KYC registration to start investing.' 
            : kycStatus === 'UNDER_REVIEW' ? 'Your KYC is currently under review.' 
            : 'KYC Verification Failed. Please retry.'}
          </div>
          {kycStatus === 'PENDING' && (
            <Link href="/kyc" className="ml-4 bg-white text-[var(--danger)] px-4 py-1.5 rounded-lg hover:bg-gray-100 transition font-bold text-xs shadow-sm">
              Complete KYC
            </Link>
          )}
        </div>
      )}

      {/* Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header / Top */}
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-2xl font-semibold text-theme-primary">Dashboard</h1>
        </div>

        {/* Top Summary Card */}
        <div className="bg-theme-card rounded-2xl p-6 shadow-sm mb-8 border border-theme">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Current Value */}
            <div>
               <p className="text-sm font-medium text-theme-muted mb-1">Current Value</p>
               <h2 className="text-3xl font-semibold text-theme-primary">
                 ₹{totalPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
               </h2>
            </div>
            
            {/* Total Returns */}
            <div>
               <p className="text-sm font-medium text-theme-muted mb-1">Total Returns</p>
               <h2 className={`text-2xl font-semibold flex items-baseline gap-2 ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
                 {totalPnl >= 0 ? '+' : ''}₹{Math.abs(totalPnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                 <span className="text-sm font-medium">
                   ({totalPnlPercent >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%)
                 </span>
               </h2>
            </div>
            
            {/* Invested Value & Cash */}
            <div className="md:border-l border-theme md:pl-6">
               <div className="flex justify-between items-center mb-3">
                 <p className="text-sm text-theme-muted">Invested</p>
                 <p className="font-semibold text-theme-primary">₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
               </div>
               <div className="flex justify-between items-center">
                 <p className="text-sm text-theme-muted">Available Cash</p>
                 <p className="font-semibold text-theme-primary">₹{portfolio.availableFunds.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
               </div>
            </div>

          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Holdings List (Takes 2 columns) */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-theme-primary mb-4">Investments ({enrichedHoldings.length})</h2>
            
            <div className="bg-theme-card rounded-2xl shadow-sm border border-theme overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-theme-surface border-b border-theme">
                    <tr>
                      <th className="px-6 py-4 text-xs font-medium text-theme-muted uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-4 text-xs font-medium text-theme-muted uppercase tracking-wider text-right">Current Value</th>
                      <th className="px-6 py-4 text-xs font-medium text-theme-muted uppercase tracking-wider text-right">Returns</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-theme divide-theme">
                    {enrichedHoldings.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-theme-muted">
                          <div className="flex flex-col items-center justify-center">
                            <Activity className="w-12 h-12 text-theme-faint mb-4" />
                            <p className="text-lg font-medium text-theme-primary mb-2">No investments yet</p>
                            <p className="text-sm">Start your investment journey today.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      enrichedHoldings.map((h, i) => {
                        const hPos = h.pnl >= 0;
                        const dayPos = h.dayChangePercent >= 0;
                        return (
                          <tr key={h.symbol} className="bg-theme-card hover:bg-theme-hover transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-theme-surface text-[var(--accent)] flex items-center justify-center font-bold text-sm shadow-sm border border-theme">
                                  {h.symbol.charAt(0)}
                                </div>
                                <div>
                                  <Link href={`/stocks/${h.symbol}`} className="font-semibold text-theme-primary group-hover:text-success transition-colors hover:underline block">
                                    {h.symbol}
                                  </Link>
                                  <p className="text-xs text-theme-muted mt-1">{h.quantity} shares • Avg ₹{h.averagePrice.toFixed(2)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <p className="font-semibold text-theme-primary">₹{h.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                              <p className="text-xs text-theme-muted mt-1">LTP ₹{h.currentPrice.toFixed(2)} <span className={`ml-1 ${dayPos ? 'text-success' : 'text-danger'}`}>{dayPos ? '▲' : '▼'} {Math.abs(h.dayChangePercent).toFixed(2)}%</span></p>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <p className={`font-semibold ${hPos ? 'text-success' : 'text-danger'}`}>
                                {hPos ? '+' : '-'}₹{Math.abs(h.pnl).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                              </p>
                              <p className={`text-xs mt-1 ${hPos ? 'text-success' : 'text-danger'}`}>
                                {hPos ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                              </p>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar (Takes 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Action / Buy Card */}
            <div className="bg-theme-card rounded-2xl p-6 shadow-sm border border-theme">
              <h3 className="font-semibold text-theme-primary mb-4">Quick Actions</h3>
              <Link href="/" className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white font-semibold py-3.5 rounded-xl transition shadow-sm hover:shadow-md">
                <Search className="w-4 h-4" /> Explore Markets
              </Link>
            </div>

            {/* Orders Panel */}
            <div className="bg-theme-card rounded-2xl p-6 shadow-sm border border-theme">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-theme-primary">Pending Orders</h3>
                <Clock className="w-4 h-4 text-theme-muted" />
              </div>
              <div className="space-y-4">
                {portfolio.orders.length === 0 ? (
                  <p className="text-sm text-theme-muted text-center py-4">No pending orders.</p>
                ) : (
                  portfolio.orders.map((order, i) => (
                    <div key={order.id} className="flex justify-between items-center text-sm border-b border-theme pb-3 last:border-0 last:pb-0">
                      <div>
                        <span className={`font-semibold mr-2 px-1.5 py-0.5 rounded text-[10px] ${order.type === 'BUY' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'}`}>{order.type}</span>
                        <span className="font-medium text-theme-primary">{order.symbol}</span>
                      </div>
                      <span className="text-theme-muted font-medium">{order.quantity} QTY</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Orderbook / Transaction History */}
            <div className="bg-theme-card rounded-2xl p-6 shadow-sm border border-theme">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-theme-primary">Orderbook</h3>
                <History className="w-4 h-4 text-theme-muted" />
              </div>
              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                {portfolio.transactions.length === 0 ? (
                  <p className="text-sm text-theme-muted text-center py-4">No recent transactions.</p>
                ) : (
                  portfolio.transactions.map((txn: any) => (
                    <div key={txn.id} className="flex flex-col text-sm border-b border-theme pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <span className={`font-semibold mr-2 px-1.5 py-0.5 rounded text-[10px] ${txn.type === 'BUY' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'}`}>{txn.type}</span>
                          <span className="font-medium text-theme-primary">{txn.symbol}</span>
                        </div>
                        <span className="text-theme-primary font-medium">₹{(txn.totalAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-theme-muted">
                        <span>{new Date(txn.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        <span>{txn.quantity || 0} QTY @ ₹{(txn.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Insights & Allocation (Optional/Simplified) */}
            <div className="bg-theme-card rounded-2xl p-6 shadow-sm border border-theme">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-theme-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" /> AI Insights
                </h3>
              </div>
              <div className={`text-xs font-bold tracking-wide inline-block px-2.5 py-1 rounded-md mb-3 ${aiSentiment.includes('BULL') ? 'bg-[var(--success)]/10 text-[var(--success)]' : aiSentiment.includes('BEAR') ? 'bg-[var(--danger)]/10 text-[var(--danger)]' : 'bg-theme-surface text-theme-muted border border-theme'}`}>
                {aiSentiment.replace('_', ' ')}
              </div>
              <p className="text-sm text-theme-muted leading-relaxed">
                {aiForecast}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
