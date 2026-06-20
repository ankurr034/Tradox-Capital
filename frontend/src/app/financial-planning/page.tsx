"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { 
  FileText, Shield, HeartPulse, TrendingUp, DollarSign, Download, CheckCircle2, Search, Calendar, ChevronDown
} from 'lucide-react';

export default function FinancialPlanning() {
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    maritalStatus: 'Single',
    city: 'Mumbai, Maharashtra',
    annualIncome: '',
    monthlyExpenses: '',
    existingInvestments: '',
    loanAmount: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const parts = dob.split('-');
    if (parts.length !== 3) return 0;
    const [year, month, day] = parts;
    const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getCareerStage = (age: number) => {
    if (age < 22) return 'Student (<22)';
    if (age <= 30) return 'Early Career (22-30)';
    if (age <= 45) return 'Mid Career (31-45)';
    if (age <= 60) return 'Late Career (46-60)';
    return 'Retired (60+)';
  };

  const calculatePlan = () => {
    const income = Number(formData.annualIncome) || 0;
    const expenses = Number(formData.monthlyExpenses) || 0;
    const investments = Number(formData.existingInvestments) || 0;
    const loan = Number(formData.loanAmount) || 0;

    const emergencyFund = expenses * 6;
    const termInsurance = (income * 20) + loan;
    
    let suggestedSip = Math.max(500, ((income / 12) - expenses) * 0.2);
    if (suggestedSip < 500) suggestedSip = 500;

    const inflationExpenses = expenses * Math.pow(1.06, 10);

    return {
      emergencyFund,
      termInsurance,
      suggestedSip,
      inflationExpenses
    };
  };

  const plan = calculatePlan();
  const age = calculateAge(formData.dob);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-violet-500 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-xl flex items-center gap-6">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-2 tracking-tight">Financial Planning</h1>
            <p className="text-blue-100 font-medium">Get personalized financial recommendations based on your profile, income, and goals</p>
          </div>
        </div>

        {step === 1 && (
          <div className="rounded-2xl border shadow-sm p-8" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
            <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Get Your Financial Plan</h2>
            <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Fill in your details below to receive personalized financial planning recommendations including term insurance, health insurance, SIP suggestions, and more.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              {/* Personal Information */}
              <div className="border rounded-xl p-6 mb-6" style={{ borderColor: 'var(--border-primary)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Full Name *</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:border-blue-500"
                      style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Date of Birth *</label>
                    <div className="relative">
                      <input 
                        required
                        type="date" 
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:border-blue-500 cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:inset-0"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Marital Status *</label>
                    <div className="flex items-center gap-6 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="Single"
                          checked={formData.maritalStatus === 'Single'}
                          onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                          className="accent-blue-600 dark:accent-blue-400 w-4 h-4"
                        />
                        Single
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        <input 
                          type="radio" 
                          name="maritalStatus" 
                          value="Married"
                          checked={formData.maritalStatus === 'Married'}
                          onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                          className="accent-blue-600 dark:accent-blue-400 w-4 h-4"
                        />
                        Married
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>City/Locality *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <select 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border outline-none text-sm transition-all focus:border-blue-500 appearance-none"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                      >
                        <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                        <option value="Delhi, NCR">Delhi, NCR</option>
                        <option value="Bangalore, Karnataka">Bangalore, Karnataka</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                    <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>Your city is categorized as Zone 1 (Metro)</p>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="border rounded-xl p-6 mb-8" style={{ borderColor: 'var(--border-primary)' }}>
                <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Financial Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Annual Income (₹) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span style={{ color: 'var(--text-muted)' }}>₹</span>
                      </div>
                      <input 
                        required
                        type="number" 
                        name="annualIncome"
                        value={formData.annualIncome}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:border-blue-500"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Monthly Expenses (₹) *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span style={{ color: 'var(--text-muted)' }}>₹</span>
                      </div>
                      <input 
                        required
                        type="number" 
                        name="monthlyExpenses"
                        value={formData.monthlyExpenses}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:border-blue-500"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Existing Investments (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span style={{ color: 'var(--text-muted)' }}>₹</span>
                      </div>
                      <input 
                        type="number" 
                        name="existingInvestments"
                        value={formData.existingInvestments}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:border-blue-500"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Loan Amount (₹) - if any</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span style={{ color: 'var(--text-muted)' }}>₹</span>
                      </div>
                      <input 
                        type="number" 
                        name="loanAmount"
                        value={formData.loanAmount}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border outline-none text-sm transition-all focus:border-blue-500"
                        style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#111827] text-white hover:bg-black font-bold py-3.5 px-4 rounded-xl transition flex justify-center items-center gap-2 dark:bg-white dark:text-black dark:hover:bg-slate-200"
              >
                <FileText className="w-5 h-5" />
                Generate Financial Plan
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 dark:bg-blue-950/20 dark:border-blue-900">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-2">
                  <Shield className="w-4 h-4" /> Term Insurance
                </div>
                <div className="text-2xl font-black text-blue-700 dark:text-blue-300">{formatCurrency(plan.termInsurance)}</div>
                <div className="text-xs text-blue-600/70 mt-1">Recommended Coverage</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 dark:bg-emerald-950/20 dark:border-emerald-900">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2">
                  <HeartPulse className="w-4 h-4" /> Health Insurance
                </div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">₹10-15 lakh</div>
                <div className="text-xs text-emerald-600/70 mt-1">Base Cover</div>
              </div>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 dark:bg-violet-950/20 dark:border-violet-900">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-sm mb-2">
                  <TrendingUp className="w-4 h-4" /> Monthly SIP
                </div>
                <div className="text-2xl font-black text-violet-700 dark:text-violet-300">{formatCurrency(plan.suggestedSip)}</div>
                <div className="text-xs text-violet-600/70 mt-1">Recommended</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 dark:bg-orange-950/20 dark:border-orange-900">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm mb-2">
                  <DollarSign className="w-4 h-4" /> Emergency Fund
                </div>
                <div className="text-2xl font-black text-orange-700 dark:text-orange-300">{formatCurrency(plan.emergencyFund)}</div>
                <div className="text-xs text-orange-600/70 mt-1">6 Months Expenses</div>
              </div>
            </div>

            {/* Main Summary Panel */}
            <div className="rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-primary)' }}>
              <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ borderColor: 'var(--border-primary)' }}>
                <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Financial Plan Summary</h2>
                <button 
                  onClick={() => window.print()}
                  className="bg-[#111827] text-white hover:bg-black font-bold py-2.5 px-5 text-sm rounded-lg transition flex justify-center items-center gap-2 dark:bg-white dark:text-black dark:hover:bg-slate-200"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-8">
                {/* Personal Info Summary */}
                <div>
                  <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Name</div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formData.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Age</div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{age} years</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Career Stage</div>
                      <div className="font-bold text-sm px-2 py-1 bg-slate-100 rounded inline-block dark:bg-slate-800" style={{ color: 'var(--text-primary)' }}>
                        {getCareerStage(age)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Region</div>
                      <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{formData.city} - Zone 1 (Metro)</div>
                    </div>
                  </div>
                </div>

                {/* Financial Analysis Summary */}
                <div>
                  <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Financial Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border dark:bg-slate-800/50" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Annual Income</div>
                      <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(formData.annualIncome) || 0)}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border dark:bg-slate-800/50" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Monthly Expenses</div>
                      <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(formData.monthlyExpenses) || 0)}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border dark:bg-slate-800/50" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Inflation-Adjusted Expenses (10 years)</div>
                      <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(plan.inflationExpenses)}</div>
                      <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>At 6% inflation rate</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border dark:bg-slate-800/50" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Existing Investments</div>
                      <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(formData.existingInvestments) || 0)}</div>
                    </div>
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Actionable Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border items-center dark:bg-slate-800/30" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Build an emergency fund of <span className="font-black">{formatCurrency(plan.emergencyFund)}</span> to cover 6 months of expenses.
                      </p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border items-center dark:bg-slate-800/30" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Start SIP of <span className="font-black">{formatCurrency(plan.suggestedSip)}</span> per month to build wealth early.
                      </p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border items-center dark:bg-slate-800/30" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Get term insurance coverage of <span className="font-black">{formatCurrency(plan.termInsurance)}</span> to protect your family.
                      </p>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border items-center dark:bg-slate-800/30" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Consider health insurance coverage of <span className="font-black">₹10-15 lakh</span> for medical emergencies.
                      </p>
                    </div>
                    {Number(formData.loanAmount) > 0 && (
                      <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border items-center dark:bg-slate-800/30" style={{ borderColor: 'var(--border-primary)' }}>
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">5</div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          Your term insurance should cover your loan amount of <span className="font-black">{formatCurrency(Number(formData.loanAmount))}</span> in addition to living expenses.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Insurance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {/* Term Insurance */}
                  <div className="border rounded-xl p-5 bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Term Insurance Details</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Coverage Amount:</span>
                        <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(plan.termInsurance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Coverage Until:</span>
                        <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>Age 60</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Includes Loan:</span>
                        <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(formData.loanAmount) || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Health Insurance */}
                  <div className="border rounded-xl p-5 bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/50">
                    <div className="flex items-center gap-2 mb-4">
                      <HeartPulse className="w-5 h-5 text-emerald-500" />
                      <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Health Insurance Details</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Recommended Cover:</span>
                        <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>₹10-15 lakh</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Based on Income:</span>
                        <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{formatCurrency(Number(formData.annualIncome) || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Region:</span>
                        <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>{formData.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end" style={{ borderColor: 'var(--border-primary)' }}>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    ← Edit Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
