import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Lock, Phone } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [mobile, setMobile] = useState('9876543210');
  const [password, setPassword] = useState('Admin@Demo2024');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const success = await login(mobile, password);
    setLoading(false);
    if (success) {
      navigate('/');
    } else {
      setErrorMsg('Invalid administrative credentials or insufficient privileges.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E8E3DC] rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
            J
          </div>
          <div>
            <h1 className="font-bold text-base text-charcoal leading-tight">JANJATHI SHIKSHA SETU</h1>
            <p className="text-xs text-[#666666]">Public Service Administrator Portal</p>
          </div>
        </div>

        <div className="mb-6 p-3.5 bg-[#FAF9F7] border border-[#E8E3DC] rounded-xl text-xs space-y-1">
          <div className="font-bold text-charcoal flex items-center gap-1.5 text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span>Prototype Demo Credentials</span>
          </div>
          <div className="text-[#666666]">
            Mobile: <span className="font-mono font-semibold text-charcoal">9876543210</span>
          </div>
          <div className="text-[#666666]">
            Password: <span className="font-mono font-semibold text-charcoal">Admin@Demo2024</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#555555] mb-1">Administrative Mobile</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E3DC] rounded-lg bg-[#FAF9F7] text-charcoal outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555555] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E3DC] rounded-lg bg-[#FAF9F7] text-charcoal outline-none focus:border-primary font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Mission Control'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
