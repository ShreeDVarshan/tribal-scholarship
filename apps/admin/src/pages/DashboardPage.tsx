import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, analyticsRes] = await Promise.all([
          axios.get('/api/admin/dashboard'),
          axios.get('/api/admin/analytics')
        ]);
        if (dashRes.data.success) setStats(dashRes.data.data);
        if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm font-medium text-[#666666] animate-pulse">Loading dashboard statistics...</div>
      </div>
    );
  }

  const COLORS = ['#1A5C38', '#2A7C6F', '#D4860A', '#3B82F6', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E8E3DC] rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Overview Status</span>
          <h1 className="text-2xl font-bold text-charcoal mt-1">Consolidated Scholarship Mission Control</h1>
          <p className="text-sm text-[#666666] mt-0.5">
            5 Ministry of Tribal Affairs Schemes unified into one central monitoring view.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs text-[#888888] block">Coverage Gap Target</span>
            <span className="text-sm font-bold text-amber-700">{stats?.coverageGap?.pendingOutreach || 8} Identified Unreached</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E3DC] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-2">
            <span className="text-xs font-semibold uppercase">Total Registered Students</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-charcoal">{stats?.students?.total || 20}</div>
          <div className="text-[12px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{stats?.students?.stCertified || 20} Verified ST Certificates</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-2">
            <span className="text-xs font-semibold uppercase">Applications Submitted</span>
            <FileText className="w-4 h-4 text-[#2A7C6F]" />
          </div>
          <div className="text-2xl font-bold text-charcoal">{stats?.applications?.total || 20}</div>
          <div className="text-[12px] text-blue-700 mt-1 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats?.applications?.underVerification || 0} Under Active Verification</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-2">
            <span className="text-xs font-semibold uppercase">Total DBT Disbursed</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-charcoal">₹{(stats?.payments?.totalDisbursed || 56000).toLocaleString('en-IN')}</div>
          <div className="text-[12px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
            <span>Direct Benefit Transfer to Bank</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-[#666666] mb-2">
            <span className="text-xs font-semibold uppercase">Coverage Gap Records</span>
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-charcoal">{stats?.coverageGap?.pendingOutreach || 8}</div>
          <div className="text-[12px] text-amber-700 mt-1 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Unreached Potential Beneficiaries</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme Distribution */}
        <div className="bg-white border border-[#E8E3DC] rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-charcoal mb-4 flex items-center justify-between">
            <span>Applications by Ministry Scheme</span>
            <span className="text-xs text-[#888888] font-normal">Active Cycle</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.applicationsByScheme || []}>
                <XAxis dataKey="scheme" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E8E3DC', borderRadius: 8, fontSize: 12 }} 
                />
                <Bar dataKey="count" fill="#1A5C38" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Breakdown */}
        <div className="bg-white border border-[#E8E3DC] rounded-xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-charcoal mb-4 flex items-center justify-between">
            <span>State Beneficiary Distribution</span>
            <span className="text-xs text-[#888888] font-normal">Top States</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.stateDistribution || []} layout="vertical">
                <XAxis type="number" stroke="#888888" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="state" type="category" stroke="#888888" fontSize={10} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E8E3DC', borderRadius: 8, fontSize: 12 }} 
                />
                <Bar dataKey="count" fill="#2A7C6F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
