import React from 'react';
import { prisma } from '@/lib/auth';
import { Briefcase, Users, DollarSign, TrendingUp } from 'lucide-react';
import AUMChart from './AUMChart';

export default async function AdminDashboardPage() {
  const [totalClients, totalPortfolios, sumFunds] = await Promise.all([
    prisma.clientProfile.count(),
    prisma.portfolio.count(),
    prisma.portfolio.aggregate({
      _sum: {
        availableFunds: true,
        usedFunds: true,
      }
    })
  ]);

  const totalAUM = (sumFunds._sum.availableFunds || 0) + (sumFunds._sum.usedFunds || 0);

  return (
    <div className="space-y-8">
      {/* Premium Admin Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-indigo-900/40"></div>
        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full"></div>
        
        <div className="relative p-8 md:p-12 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                System Online
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                Tradox <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Capital</span>
              </h1>
              <p className="text-slate-400 font-medium text-lg max-w-xl">
                Command Center & Global Portfolio Management
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 self-start md:self-auto">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Server Status</div>
                <div className="text-sm font-black text-emerald-400">Optimized</div>
              </div>
              <div className="h-10 w-px bg-slate-700"></div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</div>
                <div className="text-sm font-black text-white">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* AUM Metric */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="text-sm font-bold text-theme-muted">Total AUM</div>
          </div>
          <div className="text-3xl font-black">
            ₹{(totalAUM / 10000000).toFixed(2)} Cr
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12.5% this month
          </div>
        </div>

        {/* Clients Metric */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600">
              <Users className="h-5 w-5" />
            </div>
            <div className="text-sm font-bold text-theme-muted">Active Clients</div>
          </div>
          <div className="text-3xl font-black">
            {totalClients}
          </div>
          <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +2 new this week
          </div>
        </div>

        {/* Portfolios Metric */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="text-sm font-bold text-theme-muted">Portfolios Managed</div>
          </div>
          <div className="text-3xl font-black">
            {totalPortfolios}
          </div>
          <div className="mt-2 text-xs font-bold text-theme-secondary">
            Across all strategies
          </div>
        </div>
      </div>

      {/* Data Visualization */}
      <div className="mt-8">
        <AUMChart currentAUM={totalAUM} />
      </div>

    </div>
  );
}
