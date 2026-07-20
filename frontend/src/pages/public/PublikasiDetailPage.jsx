import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  ArrowLeft, Calendar, User, BookOpen, 
  FileText, ExternalLink, Newspaper, Award, Users,
  Eye, Clock, Share2, MessageCircle, Link as LinkIcon, Tag
} from 'lucide-react';

const UPLOAD_BASE = 'http://localhost:5001/uploads';

const JENIS_CONFIG = {
  'berita': {
    label: 'Berita',
    icon: <Newspaper size={16} />,
    color: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-200',
  },
  'kegiatan': {
    label: 'Kegiatan',
    icon: <Users size={16} />,
    color: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
  },
  'akuntabilitas': {
    label: 'Akuntabilitas',
    icon: <Award size={16} />,
    color: 'bg-emerald-100 text-brand-primary',
    border: 'border-emerald-200',
  },
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Hitung estimasi waktu baca (asumsi kecepatan baca rata-rata 200 kata/menit)
const calculateReadingTime = (text) => {
  if (!text) return 1;
  const wordCount = text.split(/\s+/).length;
  const time = Math.ceil(wordCount / 200);
  return time;
};

const PublikasiDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    // Fetch detail publikasi
    api.get(`/publikasi/${slug}`)
      .then(res => {
        const publikasi = res.data.data;
        setData(publikasi);
        
        // Fetch related posts berdasarkan tipe yang sama
        api.get(`/publikasi?tipe=${publikasi.tipe}`)
          .then(relatedRes => {
            const allRelated = relatedRes.data.data || [];
            // Filter exclude current post dan ambil max 3
            const filtered = allRelated
              .filter(item => item.id !== publikasi.id)
              .slice(0, 3);
            setRelatedPosts(filtered);
          })
          .catch(err => console.error("Gagal fetch related posts", err));
      })
      .catch(err => {
        console.error("Gagal mengambil detail publikasi:", err);
        setError("Publikasi tidak ditemukan atau terjadi kesalahan.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

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
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h2>
          <p className="text-slate-500 mb-6">{error || 'Publikasi tidak ditemukan.'}</p>
          <button 
            onClick={() => navigate('/publikasi')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
          >
            <ArrowLeft size={16} /> Kembali ke Publikasi
          </button>
        </div>
      </div>
    );
  }

  const config = JENIS_CONFIG[data.tipe?.toLowerCase()] || JENIS_CONFIG['berita'];
  const thumbnailUrl = data.foto_url ? `${UPLOAD_BASE}/${data.foto_url}` : null;
  const pdfUrl = data.lampiran_url ? `${UPLOAD_BASE}/${data.lampiran_url}` : null;
  const readingTime = calculateReadingTime(data.konten);
  
  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(data.judul);

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* ===== HERO / HEADER SECTION ===== */}
      <section className="bg-white border-b border-stone-200 pt-28 pb-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb / Back Button */}
          <Link 
            to="/publikasi" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Publikasi
          </Link>

          {/* Meta Info Utama */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-5">
            <span className={`inline-flex items-center gap-1.5 text-xs md:text-sm font-bold px-3 py-1.5 rounded-full border ${config.color} ${config.border}`}>
              {config.icon} {config.label}
            </span>
            <span className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 font-medium">
              <Calendar size={14} />
              {formatDate(data.tanggal_publikasi || data.created_at)}
            </span>
            {data.pembuat && (
              <span className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 font-medium">
                <User size={14} />
                {data.pembuat}
              </span>
            )}
          </div>

          {/* Judul Publikasi */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-6">
            {data.judul}
          </h1>
          
          {/* Metadata Tambahan (Views & Time) */}
          <div className="flex flex-wrap items-center gap-4 py-4 border-t border-stone-100">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-stone-100 px-3 py-1.5 rounded-lg">
              <Eye size={16} className="text-brand-primary" />
              {data.views_count || 1} Tayangan
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-stone-100 px-3 py-1.5 rounded-lg">
              <Clock size={16} className="text-amber-500" />
              Waktu baca: {readingTime} mnt
            </span>
          </div>
        </div>
      </section>

      {/* ===== KONTEN SECTION ===== */}
      <section className="px-4 py-10 -mt-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Gambar/Thumbnail (Jika ada) */}
          {thumbnailUrl ? (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-10 border border-stone-100 bg-white">
              <img 
                src={thumbnailUrl} 
                alt={data.judul} 
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-lg mb-10 border border-stone-100 bg-gradient-to-br from-stone-100 to-stone-200 aspect-video flex items-center justify-center max-h-[500px]">
              <BookOpen size={80} className="text-stone-300" />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-6 md:p-10">
              {/* Isi Konten */}
              <div className="prose prose-slate prose-lg md:prose-xl max-w-none mb-10">
                {data.konten ? (
                  data.konten.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-slate-600 leading-relaxed text-justify">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-400 italic">Tidak ada konten untuk publikasi ini.</p>
                )}
              </div>

              {/* Tags Section */}
              {data.tags && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
                  <Tag size={16} className="text-slate-400 mr-1" />
                  {data.tags.split(',').map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full border border-stone-200">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Lampiran PDF */}
              {pdfUrl && (
                <div className="mt-10 pt-8 border-t border-stone-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-brand-primary" />
                    Dokumen Lampiran
                  </h3>
                  <div className="bg-stone-50 p-4 md:p-5 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm md:text-base">Lampiran_Dokumen.pdf</p>
                        <p className="text-xs text-slate-500">Klik tombol di samping untuk melihat atau mengunduh</p>
                      </div>
                    </div>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
                    >
                      Buka Dokumen <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Share Footer */}
            <div className="bg-stone-50 p-6 md:p-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-600 font-bold">
                <Share2 size={18} />
                Bagikan Artikel
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
                  <LinkIcon size={16} />
                  {copied ? 'Tersalin!' : 'Salin Tautan'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Related Posts (Baca Juga) */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                Baca Juga <span className="h-[2px] bg-brand-primary w-12 rounded-full inline-block"></span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {relatedPosts.map(post => (
                  <Link to={`/publikasi/${post.slug || post.id}`} key={post.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                    <div className="aspect-video bg-stone-100 overflow-hidden relative">
                      {post.foto_url ? (
                        <img src={`${UPLOAD_BASE}/${post.foto_url}`} alt={post.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <BookOpen size={30} />
                        </div>
                      )}
                      {/* Badge Type Float */}
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded border bg-white shadow-sm flex items-center gap-1`}>
                        {JENIS_CONFIG[post.tipe?.toLowerCase()]?.label || 'Berita'}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-[11px] text-slate-400 font-medium mb-1 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(post.tanggal_publikasi)}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-brand-primary transition-colors">
                        {post.judul}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default PublikasiDetailPage;
