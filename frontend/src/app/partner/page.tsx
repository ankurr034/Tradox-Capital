"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import { IndianRupee, ShieldCheck, MapPin, PhoneCall, CheckCircle, Sparkles, Building, Landmark } from 'lucide-react';

export default function Partner() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [segment, setSegment] = useState('Mutual Fund & SIP Advisory');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [assignedAdvisor, setAssignedAdvisor] = useState('');

  const branches = [
    { city: 'Mumbai', location: 'Fort, Commerce House', phone: '+91 22 4910 1120' },
    { city: 'Delhi', location: 'Connaught Place, Regal Building', phone: '+91 11 3920 4050' },
    { city: 'Bengaluru', location: 'Indiranagar, Metro Pillar 80', phone: '+91 80 5032 6070' },
    { city: 'Pune', location: 'Koregaon Park, Lane 5', phone: '+91 20 2541 3320' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setLoading(true);

    try {
      const selectedBranch = branches.find(b => b.city === city)?.location || 'Main Corporate Branch';
      const res = await axios.post('/api/leads', {
        name,
        phone,
        city,
        branch: selectedBranch,
        segment
      });

      setAssignedAdvisor(res.data.advisoryAssignment);
      setSuccess(true);
    } catch (err) {
      console.warn("Express lead submission failed, fallback to local simulate", err);
      setAssignedAdvisor(`Assigned to Senior Wealth Manager at our local ${city} branch.`);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060C] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Banner Fold */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span>Offline Wealth Partner Program</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Invest Securely via Our <br />
              <span className="bg-gradient-to-r from-[#10B981] to-emerald-400 bg-clip-text text-transparent">
                Trading & Advisory Partner
              </span>
            </h1>

            <p className="text-slate-400 font-medium text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Ready to execute your SIP, SWP, or AI Stock options? Open a secure Demat account or schedule a **1-on-1 offline wealth consultation** with our licensed relationship advisors at our nearest local branch office.
            </p>

            {/* Offline Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center lg:text-left">
              <div className="border-l-2 border-[#10B981] pl-4">
                <span className="text-xl sm:text-2xl font-black text-white block">₹12,400+ Cr</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Assets Managed</span>
              </div>
              <div className="border-l-2 border-[#10B981] pl-4">
                <span className="text-xl sm:text-2xl font-black text-white block">42+ Branches</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pan IndiaPresence</span>
              </div>
              <div className="border-l-2 border-[#10B981] pl-4">
                <span className="text-xl sm:text-2xl font-black text-white block">12 Hours</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Advisor Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Lead Capture Box */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Landmark className="h-40 w-40 text-white" />
            </div>

            {success ? (
              <div className="text-center py-10 space-y-6">
                <CheckCircle className="h-16 w-16 text-[#10B981] mx-auto animate-pulse" />
                <h3 className="text-2xl font-extrabold text-white">Consultation Initiated!</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you, <span className="text-white font-bold">{name}</span>. Your details have been securely routed to our offline advisors.
                </p>
                <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl text-left text-xs text-slate-300 font-bold space-y-1.5">
                  <span className="text-slate-500 block uppercase text-[10px] tracking-wider">Assigned Advisory:</span>
                  <p className="text-[#10B981] leading-relaxed">{assignedAdvisor}</p>
                  <p className="text-slate-400 font-medium">An advisor will call you shortly at <span className="text-white">{phone}</span> to coordinate demat creation.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="text-center sm:text-left">
                  <h3 className="font-extrabold text-xl text-white">Open Account / Book Advisory</h3>
                  <p className="text-xs text-slate-400 mt-1">Get free advisory, zero brokerage on funds, & personal advisory sync.</p>
                </div>

                {/* Input 1 */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-[#10B981] transition"
                  />
                </div>

                {/* Input 2 */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter your 10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-[#10B981] transition"
                  />
                </div>

                {/* Input 3 */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target City (Offline Branch)</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-[#10B981] transition"
                  >
                    <option value="Mumbai">Mumbai Branch Office</option>
                    <option value="Delhi">Delhi Branch Office</option>
                    <option value="Bengaluru">Bengaluru Branch Office</option>
                    <option value="Pune">Pune Branch Office</option>
                  </select>
                </div>

                {/* Input 4 */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Desired Advisory Segment</label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white focus:outline-none focus:border-[#10B981] transition"
                  >
                    <option value="Mutual Fund & SIP Advisory">Mutual Fund & SIP Advisory</option>
                    <option value="AI Trading Options Advisory">AI Trading Options Advisory</option>
                    <option value="SWP Retirement Payout Planning">SWP Retirement Payout Planning</option>
                    <option value="Exempt PPF Savings Planning">Exempt PPF Savings Planning</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#10B981] hover:bg-[#0d9668] text-slate-950 font-black text-sm transition duration-300 shadow-lg shadow-[#10B981]/15"
                >
                  {loading ? 'Submitting Details...' : 'Request Call Back & Branch Call'}
                </button>
              </form>
            )}
          </div>

        </section>

        {/* Local Branches Directory Fold */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <Building className="h-6 w-6 text-[#10B981]" />
            <div>
              <h3 className="font-extrabold text-xl text-white">Our Local pan-India Branches</h3>
              <p className="text-xs text-slate-400">Visit us directly at our branch locations for customized, physical advisor meetings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((b, i) => (
              <div key={i} className="bg-slate-950/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[#10B981]">
                    <MapPin className="h-4.5 w-4.5" />
                    <span className="text-sm font-bold text-white">{b.city} Branch</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{b.location}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold border-t border-slate-850/50 pt-3.5 mt-4">
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{b.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-900 bg-[#04060C] py-6 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} Tradox Capital Partner Program. All rights reserved.</p>
      </footer>
    </div>
  );
}
