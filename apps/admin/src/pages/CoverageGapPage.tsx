import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Target, Flag, CheckCircle, ExternalLink, Filter } from 'lucide-react';

export const CoverageGapPage: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/coverage-gap', {
        params: { state: stateFilter || undefined }
      });
      if (res.data.success) {
        setRecords(res.data.data.records);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [stateFilter]);

  const handleFlag = async (id: string) => {
    try {
      const res = await axios.post(`/api/admin/coverage-gap/${id}/flag`);
      if (res.data.success) {
        setRecords(records.map(r => r.id === id ? { ...r, status: 'FLAGGED' } : r));
      }
    } catch (err) {
      console.error('Failed to flag record', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white border border-[#E8E3DC] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Proactive Outreach & Unreached Beneficiaries Module</span>
        </div>
        <h1 className="text-xl font-bold text-charcoal mt-1">Cross-System Coverage Gap Identification</h1>
        <p className="text-sm text-[#666666] mt-1 max-w-3xl">
          By cross-referencing mock UDISE+ school registries and APAAR university enrolments against scholarship applications, Janjathi Shiksha Setu pinpoints ST students who appear eligible but have not yet applied for their entitlements.
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-[#888888]">
          <span className="bg-[#FAF9F7] px-2.5 py-1 rounded border border-[#E8E3DC]">Mock Datasets: UDISE+ • APAAR • OTR</span>
          <span>● Prototype demonstration data</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E8E3DC]">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-[#888888]" />
          <span className="text-xs font-bold text-[#555555]">Filter State:</span>
          <select 
            value={stateFilter} 
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-xs border border-[#E8E3DC] rounded-lg px-3 py-1.5 bg-[#FAF9F7] text-charcoal outline-none focus:border-primary"
          >
            <option value="">All States</option>
            <option value="Assam">Assam</option>
            <option value="Odisha">Odisha</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>
        <span className="text-xs text-[#888888] font-medium">{records.length} potential beneficiaries identified</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E3DC] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF9F7] border-b border-[#E8E3DC] text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              <th className="p-4">Student & Source ID</th>
              <th className="p-4">Location</th>
              <th className="p-4">Institution & Level</th>
              <th className="p-4">Potential Entitlement</th>
              <th className="p-4">Outreach Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3DC] text-xs">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#888888]">Loading coverage gap records...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#888888]">No coverage gap records found for this filter.</td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF9F7] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-charcoal">{r.name}</div>
                    <div className="text-[11px] text-[#888888] font-mono">{r.externalId} ({r.sourceSystem})</div>
                  </td>
                  <td className="p-4">
                    <div className="text-charcoal font-medium">{r.district}</div>
                    <div className="text-[11px] text-[#888888]">{r.state}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-charcoal font-medium truncate max-w-[200px]">{r.institutionName}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F4F2] text-[#2A7C6F]">
                      {r.academicLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-primary">{r.potentialScheme.replace('_', ' ')}</span>
                  </td>
                  <td className="p-4">
                    {r.status === 'FLAGGED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Flag className="w-3 h-3 fill-amber-600 text-amber-600" />
                        Flagged for Field Outreach
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-[#666666]">
                        Pending Outreach
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {r.status !== 'FLAGGED' ? (
                      <button
                        onClick={() => handleFlag(r.id)}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
                      >
                        <Flag className="w-3.5 h-3.5" />
                        Flag for Outreach
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Action Dispatched
                      </span>
                    )}
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
