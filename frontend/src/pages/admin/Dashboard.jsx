import React from 'react';
import { Users, Store, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, desc, icon, bgColor, link }) => (
  <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col justify-between border border-stone-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-8">
      <div>
        <h3 className="text-slate-800 font-bold text-xl mb-1">{title}</h3>
        <p className="text-slate-500 text-sm">{desc}</p>
      </div>
      <div className={`p-4 rounded-2xl text-white ${bgColor}`}>
        {icon}
      </div>
    </div>
    <div className="pt-4 border-t border-stone-100">
      <Link to={link} className="flex items-center text-sm font-bold text-brand-primary group-hover:text-brand-accent transition-colors">
        Kelola Data <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
);

const Dashboard = () => {
  const adminName = localStorage.getItem('adminName') || 'Administrator';

  return (
    <div className="max-w-6xl mx-auto">
      
      <div className="mb-10 bg-brand-primary rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        {/* Dekorasi Latar */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-600 rounded-full opacity-50 blur-2xl"></div>
        
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, {adminName}! 👋</h1>
            <p className="text-emerald-50 text-lg max-w-2xl">Kelola seluruh konten, publikasi, dan informasi Desa Girirejo dengan mudah melalui satu panel admin cerdas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <DashboardCard 
          title="Perangkat Desa" 
          desc="Atur struktur dan profil staf."
          icon={<Users size={28} />} 
          bgColor="bg-emerald-600 shadow-emerald-200 shadow-lg"
          link="/admin/perangkat"
        />
        <DashboardCard 
          title="Katalog UMKM" 
          desc="Promosikan ekonomi lokal."
          icon={<Store size={28} />} 
          bgColor="bg-orange-500 shadow-orange-200 shadow-lg"
          link="/admin/umkm"
        />
        <DashboardCard 
          title="Publikasi Desa" 
          desc="Berita, Kegiatan & Transparansi."
          icon={<FileText size={28} />} 
          bgColor="bg-indigo-600 shadow-indigo-200 shadow-lg"
          link="/admin/publikasi"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-stone-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            💡 Tips Mengelola Website
        </h2>
        <ul className="list-none text-slate-600 space-y-4">
          <li className="flex items-start">
             <span className="bg-emerald-100 text-brand-primary p-1 rounded-md mr-3 mt-0.5"><Users size={14}/></span>
             <span>Pastikan foto perangkat desa yang diunggah berbentuk <strong>Portrait</strong> untuk hasil hover terbaik.</span>
          </li>
          <li className="flex items-start">
             <span className="bg-orange-100 text-brand-accent p-1 rounded-md mr-3 mt-0.5"><FileText size={14}/></span>
             <span>Gunakan jenis publikasi <strong>Akuntabilitas</strong> setiap akhir tahun untuk transparansi penggunaan Dana Desa (Format PDF didukung).</span>
          </li>
          <li className="flex items-start">
             <span className="bg-indigo-100 text-indigo-600 p-1 rounded-md mr-3 mt-0.5"><Store size={14}/></span>
             <span>Tambahkan nomor WhatsApp di Katalog UMKM agar calon pembeli bisa langsung terhubung dengan warga desa.</span>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
