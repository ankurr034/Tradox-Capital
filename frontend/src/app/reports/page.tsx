"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { FileText, Download, PieChart, TrendingUp, Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    fetchReport();
  }, [year]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/tax?year=${year}`);
      if (res.ok) {
        setReportData(await res.json());
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Mock download CSV
    const csvContent = "data:text/csv;charset=utf-8,Symbol,Type,Quantity,Amount,Date\n" + 
      (reportData?.transactions || []).map((t: any) => `${t.symbol},${t.type},${t.quantity},${t.totalAmount},${new Date(t.timestamp).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tax_Report_FY_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Tax & P&L Reports</h1>
              <p className="text-sm font-semibold text-theme-muted">View and download your capital gains statements.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none font-bold"
            >
              <option value="2023">FY 2023-24</option>
              <option value="2024">FY 2024-25</option>
              <option value="2025">FY 2025-26</option>
              <option value="2026">FY 2026-27</option>
            </select>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Total Turnover</div>
                <div className="text-2xl font-black">₹{reportData?.turnover.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">Realized Profit</div>
                <div className="text-2xl font-black text-emerald-500">₹{reportData?.realizedProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">STCG (Short Term)</div>
                <div className="text-2xl font-black text-rose-500">₹{reportData?.stcg.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-theme-muted mb-2">LTCG (Long Term)</div>
                <div className="text-2xl font-black text-blue-500">₹{reportData?.ltcg.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-black mb-6">Realized Transactions (FY {reportData?.financialYear})</h2>
              {reportData?.transactions?.length === 0 ? (
                <div className="text-center py-12 text-theme-muted font-bold">No realized transactions found for this financial year.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-theme-muted">Date</th>
                        <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-theme-muted">Symbol</th>
                        <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-theme-muted text-right">Qty</th>
                        <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-theme-muted text-right">Price</th>
                        <th className="px-4 py-3 font-black text-xs uppercase tracking-wider text-theme-muted text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {reportData?.transactions.map((tx: any) => (
                        <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="px-4 py-3 font-semibold">{new Date(tx.timestamp).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-bold">{tx.symbol}</td>
                          <td className="px-4 py-3 font-semibold text-right">{tx.quantity}</td>
                          <td className="px-4 py-3 font-semibold text-right">₹{tx.price?.toFixed(2)}</td>
                          <td className="px-4 py-3 font-black text-right">₹{tx.totalAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
