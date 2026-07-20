import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, Calendar, Tag, FileText, ExternalLink, Newspaper, Award, Users } from 'lucide-react';

const UPLOAD_BASE = 'http://localhost:5001/uploads';

const JENIS_CONFIG = {
  'Berita': {
    label: 'Berita',
    icon: <Newspaper size={14} />,
    color: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-200',
  },
  'Kegiatan': {
    label: 'Kegiatan',
    icon: <Users size={14} />,
    color: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
  },
  'Akuntabilitas': {
    label: 'Akuntabilitas',
    icon: <Award size={14} />,
    color: 'bg-emerald-100 text-brand-primary',
    border: 'border-emerald-200',
  },
};

const FILTER_OPTIONS = ['Semua', 'Berita', 'Kegiatan', 'Akuntabilitas'];

// Format tanggal Indonesia
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Kartu Publikasi
const PublikasiCard = ({ item }) => {
  const config = JENIS_CONFIG[item.jenis] || JENIS_CONFIG['Berita'];
  const thumbnailUrl = item.thumbnail_url
    ? `${UPLOAD_BASE}/${item.thumbnail_url}`
    : null;
  const pdfUrl = item.file_url
    ? `${UPLOAD_BASE}/${item.file_url}`
    : null;

  return (
    <article className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      {/* Thumbnail */}
      {thumbnailUrl ? (
        <div className="overflow-hidden aspect-video bg-stone-100">
          <img
            src={thumbnailUrl}
            alt={item.judul}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
          <BookOpen size={40} className="text-stone-300" />
        </div>
      )}

      {/* Konten */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        {/* Badge & Tanggal */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between mb-3 md:mb-4">
          <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full border w-fit ${config.color} ${config.border}`}>
            {config.icon} {config.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-400 font-medium">
            <Calendar size={12} />
            {formatDate(item.tanggal || item.created_at)}
          </span>
        </div>

        {/* Judul */}
        <h3 className="font-extrabold text-slate-800 text-sm md:text-lg mb-2 md:mb-3 leading-snug flex-grow line-clamp-3">
          {item.judul}
        </h3>

        {/* Ringkasan/Isi */}
        {item.ringkasan && (
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-4">
            {item.ringkasan}
          </p>
        )}

        {/* Tombol Aksi PDF */}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-emerald-50 border border-emerald-200 text-brand-primary text-[11px] md:text-sm font-bold rounded-xl hover:bg-emerald-100 hover:-translate-y-0.5 transition-all w-fit"
          >
            <FileText size={14} className="hidden sm:block" /> Buka PDF
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </article>
  );
};

const PublikasiPage = () => {
  const [publikasiList, setPublikasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Semua');

  useEffect(() => {
    api.get('/publikasi')
      .then(res => {
        const mappedData = (res.data.data || []).map(item => ({
          ...item,
          jenis: item.tipe ? item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1) : 'Berita',
          ringkasan: item.konten,
          thumbnail_url: item.foto_url,
          file_url: item.lampiran_url,
          tanggal: item.tanggal_publikasi
        }));
        setPublikasiList(mappedData);
      })
      .catch(() => setPublikasiList([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'Semua'
    ? publikasiList
    : publikasiList.filter(p => p.jenis === activeFilter);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-10 right-10 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-accent/20 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sm font-medium px-5 py-2 rounded-full mb-6">
            <BookOpen size={14} /> Transparansi & Informasi
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Berita & Kegiatan<br />
            <span className="text-slate-300">Desa Girirejo</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Pantau perkembangan terkini, laporan akuntabilitas, dan seluruh kegiatan Desa Girirejo secara transparan.
          </p>
        </div>
      </section>

      {/* ===== FILTER SECTION ===== */}
      <section className="sticky top-[73px] z-30 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeFilter === f
                  ? 'bg-slate-800 text-white shadow-md scale-105'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              {f === 'Semua' && '📋 '}
              {f === 'Berita' && '📰 '}
              {f === 'Kegiatan' && '🤝 '}
              {f === 'Akuntabilitas' && '📊 '}
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* ===== GRID PUBLIKASI ===== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Counter */}
          {!loading && (
            <div className="flex items-center gap-2 mb-8 text-slate-500 text-sm">
              <BookOpen size={15} />
              <span>
                Menampilkan <strong className="text-slate-700">{filtered.length}</strong> publikasi
                {activeFilter !== 'Semua' && <> kategori <strong className="text-slate-800">{activeFilter}</strong></>}
              </span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-stone-100">
                  <div className="aspect-video bg-stone-200" />
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-6 bg-stone-200 rounded-full w-24" />
                      <div className="h-4 bg-stone-100 rounded-full w-20" />
                    </div>
                    <div className="h-5 bg-stone-200 rounded-full w-full" />
                    <div className="h-5 bg-stone-200 rounded-full w-3/4" />
                    <div className="h-3 bg-stone-100 rounded-full w-full" />
                    <div className="h-3 bg-stone-100 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 text-slate-400">
              <div className="text-7xl mb-5">📰</div>
              <h3 className="text-xl font-bold text-slate-500 mb-2">Belum Ada Publikasi</h3>
              <p className="text-sm">
                {activeFilter === 'Semua'
                  ? 'Belum ada publikasi yang diterbitkan.'
                  : `Belum ada publikasi dalam kategori "${activeFilter}"`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map(item => (
                <PublikasiCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PublikasiPage;
