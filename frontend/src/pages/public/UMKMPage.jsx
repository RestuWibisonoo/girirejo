import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import UMKMCard from '../../components/UMKMCard';
import { Store, Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Kerajinan', 'Pertanian', 'Jasa', 'Fashion', 'Lainnya'];

const UMKMPage = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/umkm')
      .then(res => setUmkmList(res.data.data || []))
      .catch(() => setUmkmList([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = umkmList.filter(u => {
    const matchCategory = activeCategory === 'Semua' || u.kategori === activeCategory;
    const matchSearch = u.nama_usaha?.toLowerCase().includes(searchQuery.toLowerCase())
      || u.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium px-5 py-2 rounded-full mb-6">
            <Store size={14} /> Ekonomi Lokal Desa
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Katalog UMKM<br />
            <span className="text-orange-100">Desa Girirejo</span>
          </h1>
          <p className="text-orange-50 text-lg max-w-xl mx-auto">
            Dukung ekonomi lokal! Temukan produk dan usaha unggulan dari para wirausahawan desa kami.
          </p>
        </div>
      </section>

      {/* ===== FILTER & SEARCH SECTION ===== */}
      <section className="sticky top-[73px] z-30 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama usaha atau produk..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm transition-all"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-hide">
            <SlidersHorizontal size={14} className="text-slate-400 flex-shrink-0" />
            <div className="flex gap-2 flex-nowrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-accent text-white shadow-md scale-105'
                      : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== GRID UMKM ===== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Jumlah hasil */}
          {!loading && (
            <div className="flex items-center gap-2 mb-8 text-slate-500 text-sm">
              <Store size={15} />
              <span>
                Menampilkan <strong className="text-slate-700">{filtered.length}</strong> usaha
                {activeCategory !== 'Semua' && <> dalam kategori <strong className="text-brand-accent">{activeCategory}</strong></>}
              </span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-stone-100">
                  <div className="aspect-[4/3] bg-stone-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-stone-200 rounded-full w-3/4" />
                    <div className="h-3 bg-stone-100 rounded-full w-full" />
                    <div className="h-3 bg-stone-100 rounded-full w-2/3" />
                    <div className="grid grid-cols-2 gap-2 pt-3">
                      <div className="h-9 bg-orange-100 rounded-xl" />
                      <div className="h-9 bg-emerald-50 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 text-slate-400">
              <div className="text-7xl mb-5">🛒</div>
              <h3 className="text-xl font-bold text-slate-500 mb-2">Belum Ada Produk</h3>
              <p className="text-sm">
                {searchQuery
                  ? `Tidak ditemukan usaha untuk pencarian "${searchQuery}"`
                  : `Belum ada UMKM dalam kategori "${activeCategory}"`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map(u => (
                <UMKMCard key={u.id} umkm={u} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default UMKMPage;
