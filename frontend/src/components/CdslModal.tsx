"use client";

import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

interface CdslModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  stockSymbol: string;
  quantity: number;
}

export default function CdslModal({ isOpen, onClose, onSuccess, stockSymbol, quantity }: CdslModalProps) {
  const [tpin, setTpin] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newTpin = [...tpin];
    newTpin[index] = value;
    setTpin(newTpin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`tpin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !tpin[index] && index > 0) {
      const prevInput = document.getElementById(`tpin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = () => {
    const pin = tpin.join('');
    if (pin.length !== 6) {
      setError('Please enter a valid 6-digit T-PIN');
      return;
    }

    setError('');
    setIsVerifying(true);

    // Simulate network verification delay
    setTimeout(() => {
      // For simulation, let's say '123456' is the correct PIN, 
      // but we can allow any 6-digit PIN for demonstration ease if we want.
      // Let's enforce '123456' as requested in the plan.
      if (pin === '123456') {
        setIsVerifying(false);
        onSuccess(); // Trigger the actual sell order
      } else {
        setIsVerifying(false);
        setError('Incorrect T-PIN. Hint: Use 123456 for this simulation.');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-md rounded-2xl shadow-2xl border flex flex-col relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>CDSL Authorization</h2>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Central Depository Services India</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors"
          >
            <X className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              You are authorizing the sale of:
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-lg" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}>
              {quantity} × {stockSymbol}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-center mb-3" style={{ color: 'var(--text-primary)' }}>
              Enter 6-digit T-PIN to verify
            </label>
            <div className="flex items-center justify-center gap-2">
              {tpin.map((digit, idx) => (
                <input
                  key={idx}
                  id={`tpin-${idx}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={isVerifying}
                  className="w-12 h-14 text-center text-xl font-black rounded-xl border outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--bg-input)', 
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              ))}
            </div>
            {error && (
              <div className="flex items-center justify-center gap-1 mt-3 text-sm font-bold text-rose-500">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              As per SEBI guidelines, delivery sell orders require T-PIN authorization. This ensures your holdings are safe.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-elevated)' }}>
          <button 
            className="text-xs font-bold text-blue-500 hover:underline"
            onClick={() => setTpin(['1','2','3','4','5','6'])}
          >
            Forgot T-PIN?
          </button>
          
          <button
            onClick={handleVerify}
            disabled={isVerifying || tpin.join('').length < 6}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
