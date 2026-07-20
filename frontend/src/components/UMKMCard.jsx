import React from 'react';
import { MessageCircle, MapPin, Tag, ExternalLink } from 'lucide-react';

const UPLOAD_BASE = 'http://localhost:5001/uploads';

// Palet warna per kategori
const CATEGORY_COLORS = {
  'Makanan': 'bg-orange-100 text-orange-700',
  'Minuman': 'bg-cyan-100 text-cyan-700',
  'Kerajinan': 'bg-purple-100 text-purple-700',
  'Pertanian': 'bg-emerald-100 text-brand-primary',
  'Jasa': 'bg-indigo-100 text-indigo-700',
  'Fashion': 'bg-pink-100 text-pink-700',
  'Lainnya': 'bg-stone-100 text-slate-600',
};

const UMKMCard = ({ umkm }) => {
  const fotoUrl = umkm.foto_url
    ? `${UPLOAD_BASE}/${umkm.foto_url}`
    : `https://placehold.co/400x300/e2e8f0/475569?text=${encodeURIComponent(umkm.nama_usaha || 'UMKM')}`;

  const waLink = umkm.no_wa
    ? `https://wa.me/${umkm.no_wa.replace(/\D/g, '').replace(/^0/, '62')}`
    : null;

  const mapsLink = umkm.link_gmaps || null;

  const categoryColor = CATEGORY_COLORS[umkm.kategori] || CATEGORY_COLORS['Lainnya'];

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group">
      {/* Foto Produk */}
      <div className="relative overflow-hidden aspect-[4/3] bg-stone-100">
        <img
          src={fotoUrl}
          alt={umkm.nama_usaha}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Kategori Badge Overlay */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${categoryColor} backdrop-blur-sm`}>
            <Tag size={10} /> {umkm.kategori || 'Lainnya'}
          </span>
        </div>
      </div>

      {/* Konten */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-extrabold text-slate-800 text-lg mb-2 leading-snug">{umkm.nama_usaha}</h3>
        {umkm.deskripsi && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-grow">{umkm.deskripsi}</p>
        )}

        {/* Tombol Aksi */}
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-2">
          {waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 bg-brand-accent text-white text-[11px] sm:text-xs font-bold rounded-xl hover:bg-orange-600 hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle size={14} /> Beli via WA
            </a>
          ) : (
            <button disabled className="flex items-center justify-center gap-1.5 p-2 bg-stone-100 text-slate-400 text-[11px] sm:text-xs font-medium rounded-xl cursor-not-allowed">
              <MessageCircle size={14} /> Tidak Ada WA
            </button>
          )}

          {mapsLink ? (
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 p-2 bg-emerald-50 text-brand-primary border border-emerald-200 text-[11px] sm:text-xs font-bold rounded-xl hover:bg-emerald-100 hover:-translate-y-0.5 transition-all"
            >
              <MapPin size={14} /> Google Maps
            </a>
          ) : (
            <button disabled className="flex items-center justify-center gap-1.5 p-2 bg-stone-100 text-slate-400 text-[11px] sm:text-xs font-medium rounded-xl cursor-not-allowed">
              <MapPin size={14} /> Tanpa Lokasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UMKMCard;
