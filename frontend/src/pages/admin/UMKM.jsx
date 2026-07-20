import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import UMKMModal from '../../components/admin/UMKMModal';
import { Plus, Edit2, Trash2, MessageCircle, MapPin, Store, Search } from 'lucide-react';

const UPLOAD_BASE = import.meta.env.VITE_UPLOAD_URL || '/uploads';

const CATEGORY_COLORS = {
  'Makanan': 'bg-orange-100 text-orange-700',
  'Minuman': 'bg-cyan-100 text-cyan-700',
  'Kerajinan': 'bg-purple-100 text-purple-700',
  'Pertanian': 'bg-emerald-100 text-brand-primary',
  'Jasa': 'bg-indigo-100 text-indigo-700',
  'Fashion': 'bg-pink-100 text-pink-700',
  'Lainnya': 'bg-stone-100 text-slate-600',
};

const UMKM = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Kerajinan', 'Pertanian', 'Jasa', 'Fashion', 'Lainnya'];

  const fetchUMKM = async () => {
    setLoading(true);
    try {
      const res = await api.get('/umkm');
      setData(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data UMKM:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUMKM(); }, []);

  const handleOpenCreate = () => { setEditData(null); setIsModalOpen(true); };
  const handleOpenEdit = (item) => { setEditData(item); setIsModalOpen(true); };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`PERINGATAN!\n\nHapus UMKM "${nama}" secara permanen?`)) {
      try {
        await api.delete(`/umkm/${id}`);
        fetchUMKM();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus data.');
      }
    }
  };

  const filteredData = data.filter(item => {
    const matchCategory = activeCategory === 'Semua' || item.kategori === activeCategory;
    const matchSearch = item.nama_usaha?.toLowerCase().includes(searchQuery.toLowerCase())
      || item.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Katalog UMKM</h1>
          <p className="text-slate-500 mt-1">Kelola data usaha mikro, kecil, dan menengah Desa Girirejo.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-white font-bold rounded-xl hover:bg-orange-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> Tambah UMKM
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama usaha atau deskripsi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-accent text-white shadow-md'
                  : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-sm">
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider w-16">ID</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider w-20">Foto</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Nama Usaha</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500 font-medium animate-pulse">
                    Memuat data UMKM dari server...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center">
                    <Store size={40} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">
                      {searchQuery || activeCategory !== 'Semua' 
                        ? 'Tidak ada UMKM yang cocok dengan filter pencarian.' 
                        : 'Belum ada data UMKM. Klik tombol Tambah UMKM.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="p-5 text-slate-500 font-medium">#{item.id}</td>
                    <td className="p-5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shadow-sm border border-stone-200">
                        {item.foto_url ? (
                          <img src={`${UPLOAD_BASE}/${item.foto_url}`} alt={item.nama_usaha} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store size={20} className="text-stone-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="font-bold text-slate-800 mb-1">{item.nama_usaha}</div>
                      {item.deskripsi && (
                        <p className="text-slate-500 text-xs line-clamp-1 max-w-[200px]">{item.deskripsi}</p>
                      )}
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full ${CATEGORY_COLORS[item.kategori] || CATEGORY_COLORS['Lainnya']}`}>
                        {item.kategori || 'Lainnya'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1.5">
                        {item.no_wa && (
                          <a
                            href={`https://wa.me/${item.no_wa.replace(/\D/g, '').replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors w-fit font-medium"
                          >
                            <MessageCircle size={12} /> {item.no_wa}
                          </a>
                        )}
                        {item.link_gmaps && (
                          <a
                            href={item.link_gmaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors w-fit font-medium"
                          >
                            <MapPin size={12} /> Lihat Peta
                          </a>
                        )}
                        {!item.no_wa && !item.link_gmaps && (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </div>
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
                          onClick={() => handleDelete(item.id, item.nama_usaha)}
                          className="flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UMKMModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUMKM}
        initialData={editData}
      />
    </div>
  );
};

export default UMKM;
