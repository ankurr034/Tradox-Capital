"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Wallet, Trash2, Loader2, X } from 'lucide-react';

export default function ClientControls({ clientId, clientData }: { clientId: string, clientData: any }) {
  const router = useRouter();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFundsOpen, setIsFundsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [editForm, setEditForm] = useState({
    phone: clientData.phone || "",
    pan: clientData.pan || "",
    kycStatus: clientData.kycStatus || "PENDING",
  });
  
  const [fundsAmount, setFundsAmount] = useState("");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'updateProfile', ...editForm }),
      });
      if (res.ok) {
        setIsEditOpen(false);
        router.refresh();
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'adjustFunds', amount: fundsAmount }),
      });
      if (res.ok) {
        setIsFundsOpen(false);
        setFundsAmount("");
        router.refresh();
      } else {
        alert("Failed to adjust funds");
      }
    } catch (err) {
      alert("Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you SURE you want to completely delete this client? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/clients/${clientId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/clients");
      } else {
        alert("Failed to delete client");
      }
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 mt-4">
        <button onClick={() => setIsEditOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-lg transition text-sm">
          <Settings className="h-4 w-4" /> Edit Profile
        </button>
        <button onClick={() => setIsFundsOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 font-bold rounded-lg transition text-sm">
          <Wallet className="h-4 w-4" /> Adjust Funds
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 font-bold rounded-lg transition text-sm">
          <Trash2 className="h-4 w-4" /> Delete Client
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-lg">Edit Profile</h3>
              <button onClick={() => setIsEditOpen(false)}><X className="h-5 w-5 text-theme-muted"/></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-theme-muted uppercase mb-1">Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-theme-muted uppercase mb-1">PAN</label>
                <input value={editForm.pan} onChange={e => setEditForm({...editForm, pan: e.target.value})} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 dark:border-slate-700 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-bold text-theme-muted uppercase mb-1">KYC Status</label>
                <select value={editForm.kycStatus} onChange={e => setEditForm({...editForm, kycStatus: e.target.value})} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
              <button disabled={isLoading} type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl flex justify-center">
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Funds Modal */}
      {isFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-lg">Adjust Funds</h3>
              <button onClick={() => setIsFundsOpen(false)}><X className="h-5 w-5 text-theme-muted"/></button>
            </div>
            <form onSubmit={handleAdjustFunds} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-theme-muted uppercase mb-1">Amount (₹)</label>
                <input required type="number" step="0.01" placeholder="e.g. 50000 or -10000" value={fundsAmount} onChange={e => setFundsAmount(e.target.value)} className="w-full p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-800 dark:border-slate-700" />
                <p className="text-[10px] text-theme-muted mt-1">Use negative numbers to withdraw funds.</p>
              </div>
              <button disabled={isLoading} type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl flex justify-center">
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Process Adjustment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
