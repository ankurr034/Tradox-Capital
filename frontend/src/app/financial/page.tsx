"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { IndianRupee, ShieldAlert, BadgeInfo, Scale, Sparkles } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Financial() {
  const [toolType, setToolType] = useState<'PPF' | 'FD'>('PPF');
  const [amount, setAmount] = useState(150000); // PPF 80C Limit default (1.5L)
  const [years, setYears] = useState(15); // PPF minimum lock-in is 15 yrs
  const [rate, setRate] = useState(7.1); // PPF current rate

  const [totalInvested, setTotalInvested] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityValue, setMaturityValue] = useState(0);

  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [investedDataset, setInvestedDataset] = useState<number[]>([]);
  const [interestDataset, setInterestDataset] = useState<number[]>([]);

  useEffect(() => {
    let investedArr: number[] = [];
    let interestArr: number[] = [];
    let labelsArr: string[] = [];

    if (toolType === 'PPF') {
      let cumulativeInvested = 0;
      let balance = 0;
      const i = rate / 100;

      for (let y = 1; y <= years; y++) {
        cumulativeInvested += amount;
        // PPF interest calculated annually at the end of the year
        const interestAccrued = (balance + amount) * i;
        balance = balance + amount + interestAccrued;

        investedArr.push(cumulativeInvested);
        interestArr.push(Math.round(balance - cumulativeInvested));
        labelsArr.push(`Yr ${y}`);
      }

      setTotalInvested(cumulativeInvested);
      setMaturityValue(Math.round(balance));
      setTotalInterest(Math.round(balance - cumulativeInvested));
    } else {
      // Fixed Deposit (FD) - Quarterly Compounding standard
      const P = amount;
      const r = rate / 100;
      const n = 4; // Quarterly compounding

      for (let y = 1; y <= years; y++) {
        const A = P * Math.pow(1 + r / n, n * y);
        investedArr.push(P);
        interestArr.push(Math.round(A - P));
        labelsArr.push(`Yr ${y}`);
      }

      setTotalInvested(P);
      setMaturityValue(Math.round(P * Math.pow(1 + r / n, n * years)));
      setTotalInterest(Math.round(P * Math.pow(1 + r / n, n * years) - P));
    }

    setChartLabels(labelsArr);
    setInvestedDataset(investedArr);
    setInterestDataset(interestArr);
  }, [toolType, amount, years, rate]);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Invested Capital',
        data: investedDataset,
        backgroundColor: '#1e293b',
        borderRadius: 4
      },
      {
        label: 'Interest Earned',
        data: interestDataset,
        backgroundColor: '#10B981',
        borderRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 11,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.raw.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#64748b' }
      },
      y: {
        stacked: true,
        grid: { color: '#1e293b' },
        ticks: {
          color: '#64748b',
          callback: (value: any) => `₹${(value / 100000).toFixed(1)}L`
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title Fold */}
        <header className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Tax & Fixed Savings Planner
          </h1>
          <p className="text-theme-secondary text-sm font-medium">
            Optimize your long-term secure savings using India's tax-exempt instruments or high-yielding Fixed Deposits.
          </p>
        </header>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-900 border border-slate-800 p-1 rounded-full">
            <button
              onClick={() => {
                setToolType('PPF');
                setAmount(150000);
                setYears(15);
                setRate(7.1);
              }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition duration-300 ${
                toolType === 'PPF' ? 'bg-[#10B981] text-slate-950 shadow' : 'text-theme-secondary hover:text-white'
              }`}
            >
              Public Provident Fund (PPF)
            </button>
            <button
              onClick={() => {
                setToolType('FD');
                setAmount(100000);
                setYears(5);
                setRate(6.8);
              }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition duration-300 ${
                toolType === 'FD' ? 'bg-[#10B981] text-slate-950 shadow' : 'text-theme-secondary hover:text-white'
              }`}
            >
              Fixed Deposit (FD)
            </button>
          </div>
        </div>

        {/* Financial Planner Main Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Inputs Fold (Col-span 5) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            
            {/* Input 1 */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm font-bold text-theme-secondary">
                <span>{toolType === 'PPF' ? 'Annual Contribution' : 'Principal Deposit'}</span>
                <span className="text-[#10B981] flex items-center gap-0.5">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {amount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={toolType === 'PPF' ? 500 : 10000}
                max={toolType === 'PPF' ? 150000 : 10000000}
                step={toolType === 'PPF' ? 500 : 10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
              />
              <div className="flex justify-between text-[10px] text-theme-muted font-bold">
                <span>{toolType === 'PPF' ? '₹500' : '₹10K'}</span>
                <span>{toolType === 'PPF' ? '₹1.5L (Max 80C)' : '₹1Cr'}</span>
              </div>
            </div>

            {/* Input 2 */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm font-bold text-theme-secondary">
                <span>Rate of Interest (Annual)</span>
                <span className="text-[#10B981]">{rate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.05}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
              />
            </div>

            {/* Input 3 */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm font-bold text-theme-secondary">
                <span>Time Duration</span>
                <span className="text-[#10B981]">{years} Years</span>
              </div>
              <input
                type="range"
                min={toolType === 'PPF' ? 15 : 1}
                max={toolType === 'PPF' ? 30 : 25}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
              />
              <div className="flex justify-between text-[10px] text-theme-muted font-bold">
                <span>{toolType === 'PPF' ? '15 Yrs (Min)' : '1 Yr'}</span>
                <span>{toolType === 'PPF' ? '30 Yrs' : '25 Yrs'}</span>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <div className="flex justify-between items-center text-xs text-theme-secondary font-semibold">
                <span>Total Invested Capital:</span>
                <span className="text-white font-extrabold flex items-center">
                  <IndianRupee className="h-3 w-3" />
                  {totalInvested.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-theme-secondary font-semibold">
                <span>Est. Accumulative Interest:</span>
                <span className="text-[#10B981] font-extrabold flex items-center">
                  <IndianRupee className="h-3 w-3" />
                  {totalInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-theme-secondary font-black border-t border-slate-850 pt-4">
                <span>Maturity Portfolio Worth:</span>
                <span className="text-[#10B981] text-lg font-black flex items-center">
                  <IndianRupee className="h-4.5 w-4.5" />
                  {maturityValue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>

          {/* Right Visual Charts Fold (Col-span 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="h-80 w-full relative">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Smart Insight Box */}
            {toolType === 'PPF' ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3.5">
                <Scale className="h-10 w-10 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-400">EEE Tax Exemption Benefit</h4>
                  <p className="text-xs text-theme-secondary leading-relaxed mt-0.5">
                    PPF carries the supreme **Exempt-Exempt-Exempt (EEE)** tax status in India. Your principal contribution, accumulated interest, and final maturity of <span className="text-emerald-400 font-bold">₹{maturityValue.toLocaleString('en-IN')}</span> are entirely 100% tax-free!
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3.5">
                <Sparkles className="h-10 w-10 text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-blue-300">Quarterly Compounding Boost</h4>
                  <p className="text-xs text-theme-secondary leading-relaxed mt-0.5">
                    Fixed Deposits compound interest quarterly. Your compound interest yield increases your actual effective rate, yielding an extra secure earnings value of <span className="text-blue-300 font-bold">₹{totalInterest.toLocaleString('en-IN')}</span>!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Executior Advisory Sync Call-to-action */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Scale className="h-32 w-32 text-emerald-400" />
          </div>
          <div className="space-y-1.5 text-center md:text-left relative z-10">
            <h4 className="text-xl font-extrabold text-white">Ready to execute this Secure Tax Strategy?</h4>
            <p className="text-sm text-theme-secondary max-w-xl">
              Lock in secure quarterly yields. Connect with our dedicated relationship manager at your nearest offline branch to complete high-yielding **PPF or Fixed Deposit creations** in minutes.
            </p>
          </div>
          <a
            href="/partner"
            className="w-full md:w-auto px-8 py-4 rounded-xl bg-[#10B981] hover:bg-[#0d9668] text-slate-950 font-black text-sm text-center transition duration-300 shadow-lg shadow-emerald-500/10 relative z-10"
          >
            Invest via Partner Broker
          </a>
        </div>

      </main>

      <footer className="border-t border-slate-900 bg-[#04060C] py-6 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} Tradox Capital. All rights reserved.</p>
      </footer>
    </div>
  );
}
