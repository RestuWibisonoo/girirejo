import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PublikasiModal from '../../components/admin/PublikasiModal';
import { Plus, Edit2, Trash2, FileText, Newspaper, Users, Award, Calendar, ExternalLink } from 'lucide-react';

const UPLOAD_BASE = 'http://localhost:5001/uploads';

const JENIS_CONFIG = {
  'Berita': { color: 'bg-indigo-100 text-indigo-700', icon: <Newspaper size={12} /> },
  'Kegiatan': { color: 'bg-purple-100 text-purple-700', icon: <Users size={12} /> },
  'Akuntabilitas': { color: 'bg-emerald-100 text-brand-primary', icon: <Award size={12} /> },
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Publikasi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchPublikasi = async () => {
    setLoading(true);
    try {
      const res = await api.get('/publikasi');
      const mappedData = (res.data.data || []).map(item => ({
        ...item,
        jenis: item.tipe ? item.tipe.charAt(0).toUpperCase() + item.tipe.slice(1) : 'Berita',
        ringkasan: item.konten,
        thumbnail_url: item.foto_url,
        file_url: item.lampiran_url,
        tanggal: item.tanggal_publikasi
      }));
      setData(mappedData);
    } catch (err) {
      console.error('Gagal mengambil data publikasi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPublikasi(); }, []);

  const handleOpenCreate = () => { setEditData(null); setIsModalOpen(true); };
  const handleOpenEdit = (item) => { setEditData(item); setIsModalOpen(true); };

  const handleDelete = async (id, judul) => {
    if (window.confirm(`PERINGATAN!\n\nHapus publikasi "${judul}" secara permanen?`)) {
      try {
        await api.delete(`/publikasi/${id}`);
        fetchPublikasi();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus data.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Publikasi</h1>
          <p className="text-slate-500 mt-1">Kelola berita, kegiatan, dan laporan akuntabilitas Desa Girirejo.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-emerald-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> Tambah Publikasi
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-sm">
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider w-16">ID</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider w-20">Thumb</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Judul</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Jenis</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Dokumen</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500 font-medium animate-pulse">
                    Memuat data publikasi dari server...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-16 text-center">
                    <FileText size={40} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">Belum ada publikasi. Klik tombol Tambah Publikasi.</p>
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const config = JENIS_CONFIG[item.jenis] || JENIS_CONFIG['Berita'];
                  return (
                    <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                      <td className="p-5 text-slate-500 font-medium">#{item.id}</td>
                      <td className="p-5">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shadow-sm border border-stone-200">
                          {item.thumbnail_url ? (
                            <img src={`${UPLOAD_BASE}/${item.thumbnail_url}`} alt={item.judul} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText size={20} className="text-stone-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-slate-800 mb-1 max-w-[220px] line-clamp-2">{item.judul}</div>
                        {item.ringkasan && (
                          <p className="text-slate-500 text-xs line-clamp-1 max-w-[220px]">{item.ringkasan}</p>
                        )}
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${config.color}`}>
                          {config.icon} {item.jenis}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                          <Calendar size={14} className="text-slate-400" />
                          {formatDate(item.tanggal || item.created_at)}
                        </div>
                      </td>
                      <td className="p-5">
                        {item.file_url ? (
                          <a
                            href={`${UPLOAD_BASE}/${item.file_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-bold"
                          >
                            <FileText size={12} /> PDF
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="flex items-center justify-center p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.judul)}
                            className="flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PublikasiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPublikasi}
        initialData={editData}
      />
    </div>
  );
};

export default Publikasi;
