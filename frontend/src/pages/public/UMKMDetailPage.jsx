import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  ArrowLeft, User, MapPin, 
  Store, MessageCircle, Share2, Tag, DollarSign
} from 'lucide-react';

const UPLOAD_BASE = 'http://localhost:5001/uploads';

// Palet warna per kategori
const CATEGORY_COLORS = {
  'Makanan': 'bg-orange-100 text-orange-700 border-orange-200',
  'Minuman': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Kerajinan': 'bg-purple-100 text-purple-700 border-purple-200',
  'Pertanian': 'bg-emerald-100 text-brand-primary border-emerald-200',
  'Jasa': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Fashion': 'bg-pink-100 text-pink-700 border-pink-200',
  'Lainnya': 'bg-stone-100 text-slate-600 border-stone-200',
};

const UMKMDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    // Fetch detail UMKM
    api.get(`/umkm/${id}`)
      .then(res => {
        setData(res.data.data);
      })
      .catch(err => {
        console.error("Gagal mengambil detail UMKM:", err);
        setError("UMKM tidak ditemukan atau terjadi kesalahan.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-stone-50 min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-stone-200 rounded w-32 mb-8"></div>
            <div className="h-10 bg-stone-200 rounded w-3/4"></div>
            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            <div className="aspect-video bg-stone-200 rounded-2xl w-full my-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-stone-200 rounded w-full"></div>
              <div className="h-4 bg-stone-200 rounded w-full"></div>
              <div className="h-4 bg-stone-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-stone-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-6">{error || 'UMKM tidak ditemukan.'}</p>
          <button 
            onClick={() => navigate('/umkm')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={16} /> Kembali ke UMKM
          </button>
        </div>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[data.kategori] || CATEGORY_COLORS['Lainnya'];
  const fotoUrl = data.foto_url ? `${UPLOAD_BASE}/${data.foto_url}` : null;
  
  const waLink = data.no_wa
    ? `https://wa.me/${data.no_wa.replace(/\D/g, '').replace(/^0/, '62')}`
    : null;

  const mapsLink = data.link_gmaps || null;
  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(`Cek UMKM ${data.nama_usaha} di Girirejo`);

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* ===== HERO / HEADER SECTION ===== */}
      <section className="bg-white border-b border-stone-200 pt-28 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb / Back Button */}
          <Link 
            to="/umkm" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Kembali ke Katalog UMKM
          </Link>

          {/* Meta Info Utama */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-5">
            <span className={`inline-flex items-center gap-1.5 text-xs md:text-sm font-bold px-3 py-1.5 rounded-full border ${categoryColor}`}>
              <Tag size={14} /> {data.kategori || 'Lainnya'}
            </span>
            {data.nama_pemilik && (
              <span className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 font-medium">
                <User size={14} />
                Pemilik: {data.nama_pemilik}
              </span>
            )}
          </div>

          {/* Judul Usaha */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-6">
            {data.nama_usaha}
          </h1>
          
          {/* Metadata Tambahan */}
          {data.harga_mulai && (
            <div className="flex flex-wrap items-center gap-4 py-4 border-t border-stone-100">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-stone-100 px-3 py-1.5 rounded-lg">
                <DollarSign size={16} className="text-emerald-500" />
                Mulai dari: Rp {parseInt(data.harga_mulai).toLocaleString('id-ID')}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ===== KONTEN SECTION ===== */}
      <section className="px-4 py-10 -mt-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Gambar/Thumbnail */}
          {fotoUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-10 border border-stone-100 bg-white">
              <img 
                src={fotoUrl} 
                alt={data.nama_usaha} 
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-10 border border-stone-100 bg-gradient-to-br from-stone-100 to-stone-200 aspect-video flex items-center justify-center max-h-[500px]">
              <Store size={80} className="text-stone-300" />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8">
              
              {/* Main Content (Deskripsi) */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Tentang Usaha Ini</h3>
                <div className="prose prose-slate max-w-none text-slate-600 text-justify">
                  {data.deskripsi ? (
                    data.deskripsi.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="italic text-slate-400">Deskripsi belum tersedia.</p>
                  )}
                </div>
              </div>

              {/* Sidebar Action (Kontak & Maps) */}
              <div className="md:w-72 flex flex-col gap-4">
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                  <h4 className="font-bold text-slate-800 mb-4">Tertarik dengan produk ini?</h4>
                  
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-brand-accent text-white font-bold rounded-xl hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 transition-all mb-3"
                    >
                      <MessageCircle size={18} /> Hubungi via WhatsApp
                    </a>
                  ) : (
                    <button disabled className="flex items-center justify-center gap-2 w-full py-3 bg-stone-200 text-slate-400 font-bold rounded-xl cursor-not-allowed mb-3">
                      <MessageCircle size={18} /> WhatsApp Tidak Tersedia
                    </button>
                  )}

                  {mapsLink ? (
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-50 text-brand-primary border border-emerald-200 font-bold rounded-xl hover:bg-emerald-100 hover:-translate-y-0.5 transition-all"
                    >
                      <MapPin size={18} /> Lihat di Google Maps
                    </a>
                  ) : (
                    <button disabled className="flex items-center justify-center gap-2 w-full py-3 bg-stone-100 border border-stone-200 text-slate-400 font-bold rounded-xl cursor-not-allowed">
                      <MapPin size={18} /> Lokasi Belum Ditambahkan
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Share Footer */}
            <div className="bg-stone-50 p-6 md:p-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-600 font-bold">
                <Share2 size={18} />
                Bagikan UMKM
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-white border border-stone-200 text-[#1DA1F2] rounded-xl hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors shadow-sm"
                  title="Bagikan ke Twitter"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%0A${shareUrl}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="p-2.5 bg-white border border-stone-200 text-[#25D366] rounded-xl hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors shadow-sm"
                  title="Bagikan ke WhatsApp"
                >
                  <MessageCircle size={18} />
                </a>
                <button 
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors shadow-sm font-bold text-sm ${
                    copied 
                      ? 'bg-emerald-500 text-white border-emerald-500' 
                      : 'bg-white text-slate-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Tag size={16} />
                  {copied ? 'Tersalin!' : 'Salin Tautan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UMKMDetailPage;
