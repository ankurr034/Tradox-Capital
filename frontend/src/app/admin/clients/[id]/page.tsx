import React from 'react';
import { prisma } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ArrowLeft, User, Phone, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';
import NotesSection from './NotesSection';
import ClientControls from './ClientControls';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  const client = await prisma.clientProfile.findUnique({
    where: { id },
    include: {
      user: true,
      portfolio: {
        include: { holdings: true }
      },
      notes: {
        orderBy: { createdAt: 'desc' }
      },
    }
  });

  if (!client) {
    redirect('/admin/clients');
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/clients" className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black">{client.user.name}</h1>
          <p className="text-sm font-semibold text-theme-muted flex items-center gap-2">
            Client ID: {client.id.toUpperCase()} 
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {client.kycStatus}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Notes */}
        <div className="flex flex-col gap-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" /> Contact Info
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">Email</div>
              <div className="font-semibold">{client.user.email}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="h-3 w-3"/> Phone</div>
              <div className="font-semibold">{client.phone || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="h-3 w-3"/> Address</div>
              <div className="font-semibold">{client.address || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">PAN Card</div>
              <div className="font-semibold">{client.pan || 'Not provided'}</div>
            </div>
          </div>
          
          <ClientControls clientId={client.id} clientData={client} />
        </div>

        {/* Notes Section */}
        <NotesSection clientId={client.id} existingNotes={client.notes} />

        </div>

        {/* Portfolio Summary */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-amber-500" /> Portfolio Snapshot
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">Available Cash</div>
              <div className="text-2xl font-black">₹{client.portfolio?.availableFunds.toLocaleString('en-IN') || '0.00'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <div className="text-xs font-bold text-theme-muted uppercase tracking-wider mb-1">Invested Value</div>
              <div className="text-2xl font-black">₹{client.portfolio?.usedFunds.toLocaleString('en-IN') || '0.00'}</div>
            </div>
          </div>

          <h3 className="font-bold mb-3 text-sm">Holdings ({client.portfolio?.holdings.length || 0})</h3>
          {client.portfolio?.holdings.length === 0 ? (
            <div className="text-sm text-theme-muted italic p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              Client has no active holdings.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 font-bold text-xs text-theme-muted">Symbol</th>
                    <th className="pb-2 font-bold text-xs text-theme-muted text-right">Qty</th>
                    <th className="pb-2 font-bold text-xs text-theme-muted text-right">Avg Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {client.portfolio?.holdings.map(h => (
                    <tr key={h.id}>
                      <td className="py-3 font-bold">{h.symbol}</td>
                      <td className="py-3 text-right">{h.quantity}</td>
                      <td className="py-3 text-right">₹{h.averagePrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
