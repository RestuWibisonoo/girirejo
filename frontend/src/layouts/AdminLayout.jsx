import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, FileText, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="min-h-screen flex bg-stone-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col z-30 transform transition-transform duration-300 md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="Logo Girirejo" className="h-8 w-auto object-contain drop-shadow-sm" />
            <h2 className="text-xl font-bold text-brand-primary hidden md:block lg:block">Admin</h2>
          </Link>
          <button 
            className="md:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
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
      <main className="flex-grow flex flex-col relative overflow-y-auto w-full md:w-auto h-screen">
        <header className="bg-white p-4 md:p-6 shadow-sm flex items-center gap-4 sticky top-0 z-10 border-b border-stone-100">
            <button 
              className="md:hidden p-2 text-slate-600 hover:text-brand-primary transition-colors bg-stone-50 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">
                {menuItems.find(m => m.path === location.pathname || (m.path !== '/admin' && location.pathname.startsWith(m.path)))?.label || 'Panel Admin'}
            </h1>
        </header>
        <div className="p-4 md:p-8 flex-grow">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
