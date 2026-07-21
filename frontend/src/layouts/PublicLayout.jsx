import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center py-4 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="Logo Desa Girirejo" className="h-8 md:h-10 w-auto object-contain drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-brand-primary">Girirejo</h1>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-600 hover:text-brand-accent transition-colors font-medium">Beranda</Link>
            <Link to="/umkm" className="text-slate-600 hover:text-brand-accent transition-colors font-medium">UMKM</Link>
            <Link to="/publikasi" className="text-slate-600 hover:text-brand-accent transition-colors font-medium">Publikasi</Link>
            <Link to="/admin" className="text-sm px-5 py-2 bg-brand-primary text-white rounded-xl shadow-lg hover:bg-emerald-800 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Admin Panel
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-brand-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-xl transition-all duration-300 origin-top ${
          isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}>
          <nav className="flex flex-col p-4 space-y-4">
            <Link to="/" className="text-slate-600 hover:text-brand-primary font-medium p-2 rounded-lg hover:bg-stone-50">Beranda</Link>
            <Link to="/umkm" className="text-slate-600 hover:text-brand-primary font-medium p-2 rounded-lg hover:bg-stone-50">UMKM</Link>
            <Link to="/publikasi" className="text-slate-600 hover:text-brand-primary font-medium p-2 rounded-lg hover:bg-stone-50">Publikasi</Link>
            <div className="pt-2 border-t border-stone-100">
              <Link to="/admin" className="block text-center text-sm px-5 py-3 bg-brand-primary text-white rounded-xl shadow-md hover:bg-emerald-800 transition-colors w-full">
                Admin Panel
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      
      <footer className="bg-slate-900 text-stone-300 py-8 px-4 md:py-12 md:px-8 mt-16 md:mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3 justify-center md:justify-start">
                  <img src="/logo.png" alt="Logo Desa" className="w-8 h-8 object-contain" />
                  Desa Girirejo
                </h3>
                <div className="text-sm leading-relaxed space-y-3 text-slate-400">
                  <p><strong className="text-stone-300">Alamat:</strong><br/>Jl. Sindas Klopo Girirejo Tegalrejo Magelang</p>
                  <p><strong className="text-stone-300">Kode Pos:</strong> 56192</p>
                  <p><strong className="text-stone-300">Telp:</strong> 085803672629</p>
                  <p><strong className="text-stone-300">Email:</strong> girirejot.tglrj@gmail.com</p>
                </div>
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Tautan</h3>
                <ul className="space-y-3 text-sm flex flex-col items-center md:items-start text-slate-400">
                    <li><Link to="/" className="hover:text-brand-accent hover:translate-x-1 transition-all inline-block">Profil Desa</Link></li>
                    <li><Link to="/umkm" className="hover:text-brand-accent hover:translate-x-1 transition-all inline-block">Katalog UMKM</Link></li>
                    <li><Link to="/publikasi" className="hover:text-brand-accent hover:translate-x-1 transition-all inline-block">Berita & Publikasi</Link></li>
                    <li><Link to="/admin" className="hover:text-brand-accent hover:translate-x-1 transition-all inline-block">Login Admin</Link></li>
                </ul>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4">Pengunjung</h3>
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/50 shadow-inner">
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                      <span className="text-slate-400">Tahun Kemarin</span>
                      <span className="font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">12.450</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                      <span className="text-slate-400">Tahun Ini</span>
                      <span className="font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">8.921</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                      <span className="text-slate-400">Bulan Ini</span>
                      <span className="font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">645</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-slate-400">Hari Ini</span>
                      <span className="font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">24</span>
                    </li>
                  </ul>
                </div>
            </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Pemerintah Desa Girirejo.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
