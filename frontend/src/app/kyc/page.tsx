"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, ShieldCheck, AlertCircle } from 'lucide-react';

export default function KYCPage() {
  const router = useRouter();
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pan, phone, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit KYC');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/portfolio');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#e0e0e0] font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#131316] border border-[#27272a] rounded-sm shadow-2xl">
        <div className="px-6 py-4 border-b border-[#27272a] bg-[#1a1a1f] flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#00E676]" />
          <h1 className="text-sm tracking-widest text-[#a1a1aa] uppercase font-bold">KYC_VERIFICATION</h1>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center space-y-4 py-8">
              <ShieldCheck className="w-16 h-16 text-[#00E676] mx-auto" />
              <h2 className="text-lg font-bold text-[#00E676]">DATA SUBMITTED</h2>
              <p className="text-xs text-[#a1a1aa]">Your KYC is now UNDER REVIEW.</p>
              <p className="text-[10px] text-[#71717a]">Redirecting to Terminal...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-[#a1a1aa] mb-4">
                  Regulatory compliance requires identity verification. Please provide your details below.
                </p>
              </div>

              {error && (
                <div className="bg-[#FF3D00]/10 border border-[#FF3D00]/30 p-3 rounded-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#FF3D00] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[#FF3D00]">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#71717a] tracking-widest uppercase block">PAN Number</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  className="w-full bg-[#09090b] border border-[#27272a] p-2.5 text-xs text-[#e0e0e0] outline-none focus:border-[#00E676] uppercase transition-colors"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#71717a] tracking-widest uppercase block">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  className="w-full bg-[#09090b] border border-[#27272a] p-2.5 text-xs text-[#e0e0e0] outline-none focus:border-[#00E676] transition-colors"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#71717a] tracking-widest uppercase block">Residential Address</label>
                <textarea
                  required
                  rows={3}
                  placeholder="123 Trading Street, Floor 4..."
                  className="w-full bg-[#09090b] border border-[#27272a] p-2.5 text-xs text-[#e0e0e0] outline-none focus:border-[#00E676] transition-colors resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e0e0e0] text-[#09090b] font-bold py-3 text-xs tracking-widest uppercase hover:bg-[#00E676] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'PROCESSING...' : '[ SUBMIT_DATA ]'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
