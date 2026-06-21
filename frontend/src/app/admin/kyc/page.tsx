import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import KYCActionButtons from './KYCActionButtons';

export default async function AdminKYCPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !['ADMIN', 'MANAGER'].includes((session.user as any).role)) {
    redirect('/login');
  }

  // Fetch profiles that have submitted KYC
  const pendingProfiles = await prisma.clientProfile.findMany({
    where: {
      kycStatus: {
        in: ['UNDER_REVIEW', 'APPROVED', 'REJECTED']
      }
    },
    include: {
      user: true
    },
    orderBy: {
      kycStatus: 'desc' // UNDER_REVIEW typically sorts before APPROVED
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-500" /> Compliance & KYC
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="font-semibold text-slate-700">KYC Applications</h2>
        </div>
        
        {pendingProfiles.length === 0 ? (
          <div className="p-8 text-center text-theme-muted">
            No KYC applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold text-slate-600">Client Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">PAN Number</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Phone</th>
                  <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-3 font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{profile.user.name}</td>
                    <td className="px-6 py-4 text-theme-muted">{profile.user.email}</td>
                    <td className="px-6 py-4 font-mono">{profile.pan || 'N/A'}</td>
                    <td className="px-6 py-4">{profile.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        profile.kycStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        profile.kycStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {profile.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {profile.kycStatus === 'UNDER_REVIEW' ? (
                        <KYCActionButtons profileId={profile.id} />
                      ) : (
                        <span className="text-xs text-theme-secondary font-semibold uppercase">PROCESSED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
