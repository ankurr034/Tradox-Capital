"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Mail, Lock, Eye, EyeOff, Shield, ChevronRight, User, Phone, TrendingUp, Cpu } from 'lucide-react';

export default function SignupPage() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative px-4 py-16 sm:py-24">

        {/* Ambient Background Glows */}
        <div
          className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-30"
          style={{ background: theme === 'dark' ? 'radial-gradient(circle, rgba(16,185,129,0.15), transparent)' : 'radial-gradient(circle, rgba(16,185,129,0.08), transparent)' }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{ background: theme === 'dark' ? 'radial-gradient(circle, rgba(59,130,246,0.12), transparent)' : 'radial-gradient(circle, rgba(59,130,246,0.06), transparent)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none opacity-15"
          style={{ background: theme === 'dark' ? 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)' : 'radial-gradient(circle, rgba(139,92,246,0.05), transparent)' }}
        />

        <div className="relative w-full max-w-4xl z-10 flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden" style={{ borderColor: 'var(--border-primary)', borderWidth: 1 }}>
          
          {/* Left panel (Form) */}
          <div
            className="w-full md:w-3/5 p-8 sm:p-10 backdrop-blur-xl"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                Create Account
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Join Tradox Capital and access institutional-grade tools.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Phone Number
                  </label>
                  <div className="relative flex">
                    <span className="flex items-center justify-center px-3 border border-r-0 rounded-l-xl text-sm font-semibold" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-3 pr-4 py-2.5 rounded-r-xl border text-sm font-semibold outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-primary)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:opacity-70 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      ) : (
                        <Eye className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-semibold outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/40"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:opacity-70 transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      ) : (
                        <Eye className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Agree to terms */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border accent-emerald-500 cursor-pointer"
                  style={{ borderColor: 'var(--border-primary)' }}
                />
                <label htmlFor="agree" className="text-[11px] sm:text-xs font-semibold cursor-pointer leading-tight" style={{ color: 'var(--text-secondary)' }}>
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 mt-4"
              >
                <span>Create Account</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-7 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-bold transition">
                Sign in
              </Link>
            </p>
          </div>

          {/* Right panel (Features) - Hidden on mobile */}
          <div 
            className="hidden md:flex md:w-2/5 p-10 flex-col justify-center relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-elevated)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Tradox Capital Edge</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 bg-emerald-500/20 p-2 rounded-lg h-fit">
                    <Cpu className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>AI-Powered Stock Forecasting</h4>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>Leverage deep learning models to predict market trends and optimize allocations.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-blue-500/20 p-2 rounded-lg h-fit">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Real-Time Portfolio Analytics</h4>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>Live monitoring, Kautilya stress testing, and dynamic rebalancing tools.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 bg-rose-500/20 p-2 rounded-lg h-fit">
                    <Shield className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Bank-Grade Security</h4>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>Your data is encrypted with bank-grade AES 256-bit security standards.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
