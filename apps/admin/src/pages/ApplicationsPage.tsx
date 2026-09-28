import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, Eye, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/applications', {
        params: { status: statusFilter || undefined }
      });
      if (res.data.success) {
        setApps(res.data.data.applications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISBURSED':
      case 'SANCTIONED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">DISBURSED / APPROVED</span>;
      case 'DEPARTMENT_VERIFICATION':
      case 'INSTITUTION_VERIFICATION':
      case 'DOCUMENT_VERIFICATION':
      case 'IDENTITY_VERIFICATION':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">IN VERIFICATION</span>;
      case 'DEFICIENCY':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">DEFICIENCY DETECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-charcoal">Scholarship Applications Registry</h1>
          <p className="text-xs text-[#666666] mt-0.5">Central tracking for all 5 Ministry of Tribal Affairs schemes</p>
        </div>
        <div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#E8E3DC] rounded-lg px-3 py-1.5 bg-white text-charcoal outline-none focus:border-primary font-medium"
          >
            <option value="">All Statuses</option>
            <option value="DEPARTMENT_VERIFICATION">Department Verification</option>
            <option value="INSTITUTION_VERIFICATION">Institution Verification</option>
            <option value="SANCTIONED">Sanctioned</option>
            <option value="DISBURSED">Disbursed</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF9F7] border-b border-[#E8E3DC] text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              <th className="p-4">App ID & Scheme</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Current Stage</th>
              <th className="p-4">Last Event</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3DC]">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#888888]">Loading applications...</td></tr>
            ) : apps.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#888888]">No applications match criteria.</td></tr>
            ) : (
              apps.map((app) => (
                <tr key={app.id} className="hover:bg-[#FAF9F7] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-charcoal font-mono">{app.applicationNumber}</div>
                    <div className="text-[11px] text-primary font-medium">{app.scheme.shortName}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-charcoal">{app.studentProfile.fullName}</div>
                    <div className="text-[11px] text-[#888888]">{app.studentProfile.mobile}</div>
                  </td>
                  <td className="p-4">
                    <div>{app.studentProfile.district}</div>
                    <div className="text-[11px] text-[#888888]">{app.studentProfile.state}</div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(app.status)}
                    <div className="text-[11px] text-[#666666] mt-1">{app.status.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4 text-[#666666] max-w-xs truncate">
                    {app.timeline?.[0]?.description || 'Processed'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
