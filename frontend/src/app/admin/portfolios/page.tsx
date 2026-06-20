import React from 'react';
import { prisma } from '@/lib/auth';
import { FolderKanban, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminPortfoliosPage() {
  const portfolios = await prisma.portfolio.findMany({
    include: {
      clientProfile: {
        include: {
          user: true
        }
      },
      holdings: true,
    }
  });

  const portfoliosWithCalculatedValues = portfolios.map(portfolio => {
    const totalHoldingsValue = portfolio.holdings.reduce((sum, holding) => sum + holding.investedValue, 0);
    const totalValue = portfolio.availableFunds + totalHoldingsValue;
    return {
      ...portfolio,
      totalValue,
      riskProfile: 'Balanced'
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Portfolios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500">
              <FolderKanban className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-500 dark:text-slate-400">Total Portfolios</h3>
          </div>
          <div className="text-4xl font-black">{portfoliosWithCalculatedValues.length}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-500">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-500 dark:text-slate-400">Total AUM Managed</h3>
          </div>
          <div className="text-4xl font-black">
            ₹{portfoliosWithCalculatedValues.reduce((acc, p) => acc + p.totalValue, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-slate-500">Client</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-slate-500">Risk Profile</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-slate-500">Holdings</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-slate-500 text-right">Available Funds</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-slate-500 text-right">Total Value</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-slate-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {portfoliosWithCalculatedValues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-bold">
                    No portfolios found.
                  </td>
                </tr>
              ) : portfoliosWithCalculatedValues.map(portfolio => (
                <tr key={portfolio.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{portfolio.clientProfile.user.name}</div>
                    <div className="text-xs text-slate-500">{portfolio.clientProfile.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-black bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      {portfolio.riskProfile}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold">{portfolio.holdings.length} Assets</div>
                  </td>
                  <td className="px-6 py-4 text-right font-black">
                    ₹{portfolio.availableFunds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-blue-600 dark:text-blue-400">
                    ₹{portfolio.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/admin/clients/${portfolio.clientProfileId}`} className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline">
                      View Client
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
