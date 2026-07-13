import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm py-4 px-8 flex justify-between items-center transition-all duration-300">
        <h1 className="text-2xl font-bold text-brand-primary">Girirejo</h1>
        <nav className="space-x-8 flex items-center">
          <Link to="/" className="text-slate-600 hover:text-brand-accent transition-colors font-medium">Beranda</Link>
          <Link to="/umkm" className="text-slate-600 hover:text-brand-accent transition-colors font-medium">UMKM</Link>
          <Link to="/publikasi" className="text-slate-600 hover:text-brand-accent transition-colors font-medium">Publikasi</Link>
          <Link to="/admin" className="text-sm px-5 py-2 bg-brand-primary text-white rounded-xl shadow-lg hover:bg-emerald-800 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Admin Panel
          </Link>
        </nav>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-slate-900 text-stone-300 py-12 px-8 mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Desa Girirejo</h3>
                <p className="text-sm leading-relaxed">Website resmi pelayanan dan informasi Desa Girirejo. Membangun desa yang mandiri, transparan, dan sejahtera.</p>
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-4">Tautan</h3>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/" className="hover:text-brand-accent">Profil Desa</Link></li>
                    <li><Link to="/umkm" className="hover:text-brand-accent">Katalog UMKM</Link></li>
                </ul>
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
