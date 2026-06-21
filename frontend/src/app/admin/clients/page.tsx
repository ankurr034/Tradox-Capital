import React from 'react';
import { prisma } from '@/lib/auth';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';
import AddClientModal from './AddClientModal';
import AdminActions from './AdminActions';

export default async function AdminClientsPage() {
  const clients = await prisma.clientProfile.findMany({
    include: {
      user: true,
      portfolio: true,
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Clients</h1>
        <AddClientModal />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-secondary" />
            <input 
              type="text" 
              placeholder="Search clients by name, email, or PAN..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-theme-muted">Client Name</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-theme-muted">Contact</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-theme-muted">Status</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-theme-muted text-right">Available Funds</th>
                <th className="px-6 py-4 font-black text-xs uppercase tracking-wider text-theme-muted text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-theme-muted font-bold">
                    No clients found. Click "Add Client" to onboard someone.
                  </td>
                </tr>
              ) : clients.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{client.user.name}</div>
                    <div className="text-xs text-theme-muted">ID: {client.id.substring(0,8).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 dark:text-theme-secondary">{client.user.email}</div>
                    <div className="text-xs text-theme-muted">{client.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-black ${
                      client.kycStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      client.kycStatus === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                      {client.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black">
                    ₹{client.portfolio?.availableFunds.toLocaleString('en-IN') || '0.00'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <AdminActions clientId={client.id} />
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
