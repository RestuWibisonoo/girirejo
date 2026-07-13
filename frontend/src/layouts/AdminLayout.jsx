import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, FileText, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/perangkat', icon: <Users size={20} />, label: 'Perangkat Desa' },
    { path: '/admin/umkm', icon: <Store size={20} />, label: 'Katalog UMKM' },
    { path: '/admin/publikasi', icon: <FileText size={20} />, label: 'Publikasi' },
  ];

  return (
    <div className="min-h-screen flex bg-stone-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col z-20">
        <div className="p-6 border-b border-stone-100 flex items-center justify-center">
          <h2 className="text-xl font-bold text-brand-primary">Admin Girirejo</h2>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-md' 
                    : 'text-slate-600 hover:bg-stone-100 hover:text-brand-primary'
                }`}
              >
                {item.icon} <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 p-3 w-full rounded-xl hover:bg-red-50 text-red-600 transition-colors font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative overflow-y-auto">
        <header className="bg-white p-6 shadow-sm flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-slate-800">
                {menuItems.find(m => m.path === location.pathname)?.label || 'Panel Admin'}
            </h1>
        </header>
        <div className="p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
