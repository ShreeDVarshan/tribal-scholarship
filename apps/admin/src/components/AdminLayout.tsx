import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckCircle2, 
  Target, 
  CreditCard, 
  BarChart3, 
  ShieldAlert, 
  LogOut,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Applications', path: '/applications', icon: FileText },
    { label: 'Students', path: '/students', icon: Users },
    { label: 'Verification Queue', path: '/verification', icon: CheckCircle2 },
    { label: 'Coverage Gap', path: '/coverage-gap', icon: Target },
    { label: 'Payments & DBT', path: '/payments', icon: CreditCard },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Audit Logs', path: '/audit-logs', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen bg-[#F9F7F4] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E8E3DC] flex flex-col justify-between">
        <div>
          {/* Logo Brand */}
          <div className="p-5 border-b border-[#E8E3DC]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                J
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-charcoal leading-tight">
                  JANJATHI SETU
                </h1>
                <p className="text-[11px] text-[#666666] font-medium">Ministry of Tribal Affairs</p>
              </div>
            </div>
            <div className="mt-3 px-2 py-1 bg-primary-light text-primary text-[11px] font-semibold rounded inline-block">
              Admin Portal • Demo Mode
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-[#555555] hover:bg-[#F3F1EE] hover:text-charcoal'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-[#E8E3DC] bg-[#FAF9F7]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2A7C6F] text-white flex items-center justify-center font-bold text-xs">
              RS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-charcoal truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[11px] text-[#666666] truncate">{user?.email || 'admin@janjathi.gov.in'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#E8E3DC] rounded-lg text-xs font-semibold text-[#883333] bg-white hover:bg-[#FFF5F5] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-[#E8E3DC] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-xs text-[#666666]">Scholarship Management Infrastructure</span>
            <h2 className="text-lg font-bold text-charcoal">One Platform. One Profile. One Right.</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              API Connected
            </span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
