"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';

export default function KYCActionButtons({ profileId }: { profileId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'APPROVE' | 'REJECT') => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kyc/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action }),
      });

      if (!res.ok) {
        throw new Error('Failed to update KYC status');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error updating KYC status');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleAction('APPROVE')}
        disabled={loading}
        className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded transition disabled:opacity-50"
        title="Approve KYC"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleAction('REJECT')}
        disabled={loading}
        className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded transition disabled:opacity-50"
        title="Reject KYC"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
