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
    <div>
      <h1 className="text-3xl font-black mb-8">Overview</h1>
      
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
