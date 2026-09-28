import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, AlertTriangle, FileText, Check, ShieldCheck } from 'lucide-react';

export const VerificationQueuePage: React.FC = () => {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/verification');
      if (res.data.success) {
        setDocs(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (docId: string) => {
    try {
      const res = await axios.post(`/api/admin/verification/${docId}/approve`);
      if (res.data.success) {
        setDocs(docs.filter(d => d.id !== docId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-charcoal">Document Verification Exception Queue</h1>
        <p className="text-xs text-[#666666] mt-0.5">
          Unified Verification Layer: Documents flagged for manual inspection without blocking the student's workflow.
        </p>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF9F7] border-b border-[#E8E3DC] text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              <th className="p-4">Student</th>
              <th className="p-4">Document Type</th>
              <th className="p-4">Exception Reason / Flag</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E3DC]">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#888888]">Loading verification exceptions...</td></tr>
            ) : docs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-[#888888]">No pending exceptions in the verification queue.</td></tr>
            ) : (
              docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FAF9F7] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-charcoal">{doc.studentProfile.fullName}</div>
                    <div className="text-[11px] text-[#888888]">{doc.studentProfile.district}, {doc.studentProfile.state}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-charcoal">{doc.documentName}</div>
                    <div className="text-[11px] text-[#888888]">{doc.documentType}</div>
                  </td>
                  <td className="p-4 text-amber-700">
                    <div className="flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{doc.verifications?.[0]?.reason || 'Requires officer manual validation'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleApprove(doc.id)}
                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Approve Override
                    </button>
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
