"use client";

import React, { useState } from 'react';
import { MoreVertical, ShieldAlert, UserCheck, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminActions({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);
  
  const handleImpersonate = () => {
    alert(`Impersonating client ${clientId}. You will now see the dashboard as they do.`);
    // Mock impersonation redirect
    window.location.href = '/dashboard';
  };

  const handleSuspend = () => {
    alert(`Client ${clientId} suspended. They can no longer log in or trade.`);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <Link 
          href={`/admin/clients/${clientId}`} 
          className="p-2 inline-flex rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-theme-secondary hover:text-blue-500"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </Link>
        <button 
          onClick={() => setOpen(!open)}
          className="p-2 inline-flex rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition text-theme-secondary"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="py-1">
              <button
                onClick={() => { setOpen(false); handleImpersonate(); }}
                className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-theme-primary hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4 text-blue-500" /> Impersonate
              </button>
              <button
                onClick={() => { setOpen(false); handleSuspend(); }}
                className="w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2"
              >
                <ShieldAlert className="h-4 w-4" /> Suspend Account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
