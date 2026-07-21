import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Store, BookOpen, MapPin, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import PerangkatCard from '../../components/PerangkatCard';

// --- Data Statis Infografis ---
const stats = [
  { label: 'Jiwa Warga', value: '3.247', icon: '👥' },
  { label: 'KK Terdaftar', value: '892', icon: '🏠' },
  { label: 'UMKM Aktif', value: '48', icon: '🛒' },
  { label: 'Luas Wilayah', value: '4,2 Km²', icon: '🗺️' },
];

// --- Komponen Stat Card ---
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
    <div className="text-4xl mb-3">{icon}</div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-emerald-100 text-sm font-medium">{label}</div>
  </div>
);

// --- Komponen Feature Card ---
const FeatureCard = ({ icon, title, desc, link, linkLabel }) => {
  const isAnchor = link.startsWith('#');
  
  const handleAnchorClick = (e) => {
    e.preventDefault();
    document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-stone-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col">
      <div className="text-4xl mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed flex-grow">{desc}</p>
      
      {isAnchor ? (
        <a href={link} onClick={handleAnchorClick} className="mt-6 inline-flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:text-brand-accent transition-colors cursor-pointer">
          {linkLabel} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </a>
      ) : (
        <Link to={link} className="mt-6 inline-flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:text-brand-accent transition-colors">
          {linkLabel} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
};

// --- Halaman Utama ---
const HomePage = () => {
  const [perangkat, setPerangkat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/perangkat-desa')
      .then(res => setPerangkat(res.data.data || []))
      .catch(() => setPerangkat([]))
      .finally(() => setLoading(false));

    // Animasi GSAP Hero Section bergaya Premium (Karamel.id style)
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.to('.hero-text-line', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.15,
      ease: "power4.out",
      startAt: { y: "100%", opacity: 0 }
    })
    .to('.hero-desc', {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
      startAt: { y: "100%", opacity: 0 }
    }, "-=1.1")
    .to('.hero-btn', {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      ease: "expo.out",
      startAt: { y: 30, opacity: 0 }
    }, "-=1.2");
  }, []);

  return (
    <div className="bg-stone-50">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[75vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-12 md:pt-0">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700" />
        {/* Dekorasi Blob */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-12 md:py-32">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-emerald-100 text-sm font-medium px-5 py-2.5 rounded-full mb-8">
            <MapPin size={14} />
            Kabupaten Tegalrejo, Jawa Tengah
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight flex flex-col items-center">
            <div className="overflow-hidden pb-1 md:pb-2">
              <div className="hero-text-line">Selamat Datang di</div>
            </div>
            <div className="overflow-hidden pb-3 md:pb-4 mt-1 md:mt-2">
              <div className="hero-text-line text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                Desa Girirejo
              </div>
            </div>
          </h1>
          
          <div className="overflow-hidden max-w-2xl mx-auto mb-12">
            <p className="hero-desc text-xl text-emerald-100 leading-relaxed">
              Bersama membangun desa yang mandiri, transparan, dan sejahtera untuk seluruh warga Girirejo.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/umkm"
              className="hero-btn opacity-0 inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              <Store size={20} /> Lihat Produk UMKM
            </Link>
            <Link
              to="/publikasi"
              className="hero-btn opacity-0 inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 hover:-translate-y-0.5 transition-all"
            >
              <BookOpen size={20} /> Berita & Kegiatan
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown size={28} />
        </div>
      </section>

      {/* ===== INFOGRAFIS SECTION ===== */}
      <section className="bg-gradient-to-br from-emerald-800 to-teal-700 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Desa Girirejo dalam Angka</h2>
            <p className="text-emerald-200">Data terkini yang mencerminkan perkembangan desa kami</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ===== VISI & MISI SECTION ===== */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Dekorasi Kiri */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-700 to-teal-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative z-10">
                  <div className="text-5xl mb-6">🌿</div>
                  <h3 className="text-3xl font-extrabold mb-5 leading-tight">Visi Desa Girirejo</h3>
                  <blockquote className="text-emerald-50 text-lg italic leading-relaxed border-l-4 border-emerald-300 pl-5">
                    "Terwujudnya Desa Girirejo yang Mandiri, Sejahtera, dan Berbudaya Berbasis Potensi Lokal Secara Berkelanjutan."
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Misi Kanan */}
            <div>
              <div className="inline-block bg-emerald-100 text-brand-primary text-sm font-bold px-4 py-2 rounded-full mb-5">
                🎯 Misi Kami
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8 leading-tight">
                Bergerak Maju <br />
                <span className="text-brand-primary">Bersama Warga</span>
              </h2>
              <ul className="space-y-5">
                {[
                  'Meningkatkan kualitas pelayanan publik yang cepat dan transparan',
                  'Memberdayakan UMKM dan potensi ekonomi lokal warga desa',
                  'Membangun infrastruktur yang merata dan berkelanjutan',
                  'Memperkuat nilai budaya dan kerukunan antar warga',
                ].map((m, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center font-bold text-sm mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{m}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LAYANAN SECTION ===== */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-stone-50 to-stone-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-emerald-100 text-brand-primary text-sm font-bold px-4 py-2 rounded-full mb-5">
              Layanan Digital Desa
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Semua Informasi, Satu Tempat</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Akses berbagai informasi dan layanan desa dengan mudah melalui portal digital kami.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              icon="🧑‍🤝‍🧑"
              title="Struktur Perangkat Desa"
              desc="Kenali para perangkat desa Girirejo yang berdedikasi melayani masyarakat setiap hari."
              link="#perangkat-desa"
              linkLabel="Lihat Struktur"
            />
            <FeatureCard
              icon="🛍️"
              title="Katalog UMKM"
              desc="Temukan dan dukung produk-produk unggulan dari para pelaku UMKM desa Girirejo."
              link="/umkm"
              linkLabel="Jelajahi UMKM"
            />
            <FeatureCard
              icon="📰"
              title="Publikasi & Transparansi"
              desc="Ikuti perkembangan kegiatan desa dan pantau laporan penggunaan Dana Desa secara transparan."
              link="/publikasi"
              linkLabel="Baca Berita"
            />
          </div>
        </div>
      </section>

      {/* ===== PERANGKAT DESA SECTION ===== */}
      <section id="perangkat-desa" className="py-16 md:py-24 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-emerald-100 text-brand-primary text-sm font-bold px-4 py-2 rounded-full mb-5">
              Tim Pemerintahan
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Perangkat Desa Girirejo</h2>
            <p className="text-slate-500">Hover pada foto untuk mengenal lebih dekat sosok di balik layanan desa kami.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-full aspect-[4/5] bg-stone-200 rounded-2xl max-w-[280px]" />
                  <div className="h-4 bg-stone-200 rounded-full w-32" />
                  <div className="h-3 bg-stone-100 rounded-full w-24" />
                </div>
              ))}
            </div>
          ) : perangkat.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">Data perangkat desa belum tersedia.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12 md:gap-16">
              {/* Level 1: Kepala Desa */}
              {perangkat.filter(p => p.urutan_tampil === 1).length > 0 && (
                <div className="flex flex-col items-center relative">
                  <div className="w-full max-w-[280px]">
                    {perangkat.filter(p => p.urutan_tampil === 1).map((p) => (
                      <PerangkatCard key={p.id} perangkat={p} />
                    ))}
                  </div>
                  <div className="hidden md:block w-px h-12 bg-emerald-200 mt-4 absolute -bottom-16"></div>
                </div>
              )}

              {/* Level 2: Sekretaris Desa */}
              {perangkat.filter(p => p.urutan_tampil === 2).length > 0 && (
                <div className="flex flex-col items-center relative mt-4 md:mt-8">
                  <div className="w-full max-w-[280px]">
                    {perangkat.filter(p => p.urutan_tampil === 2).map((p) => (
                      <PerangkatCard key={p.id} perangkat={p} />
                    ))}
                  </div>
                </div>
              )}

              {/* Level 3: Kaur */}
              {(() => {
                const kaur = perangkat.filter(p => p.urutan_tampil >= 3 && p.urutan_tampil <= 5);
                if (kaur.length === 0) return null;
                const kaurDup = [...kaur, ...kaur, ...kaur];

                return (
                  <div className="mt-8 border-t border-emerald-100/50 pt-12 overflow-hidden w-full relative">
                    <h3 className="text-center text-xl font-bold text-slate-700 mb-8">Urusan Sekretariat</h3>
                    
                    <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] gap-4 md:gap-8">
                      {kaurDup.map((p, index) => (
                        <div className="w-[180px] md:w-[260px] shrink-0" key={`k-${p.id}-${index}`}>
                          <PerangkatCard perangkat={p} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute top-20 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-stone-50 to-transparent pointer-events-none"></div>
                    <div className="absolute top-20 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-stone-50 to-transparent pointer-events-none"></div>
                  </div>
                );
              })()}

              {/* Level 4: Kasi */}
              {(() => {
                const kasi = perangkat.filter(p => p.urutan_tampil >= 6 && p.urutan_tampil <= 8);
                if (kasi.length === 0) return null;
                const kasiDup = [...kasi, ...kasi, ...kasi];

                return (
                  <div className="mt-4 border-t border-emerald-100/50 pt-12 overflow-hidden w-full relative">
                    <h3 className="text-center text-xl font-bold text-slate-700 mb-8">Pelaksana Teknis</h3>
                    
                    <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] gap-4 md:gap-8">
                      {kasiDup.map((p, index) => (
                        <div className="w-[180px] md:w-[260px] shrink-0" key={`t-${p.id}-${index}`}>
                          <PerangkatCard perangkat={p} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute top-20 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-stone-50 to-transparent pointer-events-none"></div>
                    <div className="absolute top-20 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-stone-50 to-transparent pointer-events-none"></div>
                  </div>
                );
              })()}

              {/* Level 5: Kadus */}
              {(() => {
                const kadus = perangkat.filter(p => p.urutan_tampil >= 9);
                if (kadus.length === 0) return null;
                const kadusDup = [...kadus, ...kadus, ...kadus];

                return (
                  <div className="mt-4 border-t border-emerald-100/50 pt-12 overflow-hidden w-full relative">
                    <h3 className="text-center text-xl font-bold text-slate-700 mb-8">Pelaksana Kewilayahan (Kepala Dusun)</h3>
                    
                    <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] gap-4 md:gap-8">
                      {kadusDup.map((p, index) => (
                        <div className="w-[180px] md:w-[260px] shrink-0" key={`d-${p.id}-${index}`}>
                          <PerangkatCard perangkat={p} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute top-20 left-0 w-8 md:w-32 h-full bg-gradient-to-r from-stone-50 to-transparent pointer-events-none"></div>
                    <div className="absolute top-20 right-0 w-8 md:w-32 h-full bg-gradient-to-l from-stone-50 to-transparent pointer-events-none"></div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
