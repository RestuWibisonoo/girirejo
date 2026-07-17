import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PerangkatModal from '../../components/admin/PerangkatModal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const PerangkatDesa = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Kontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Mengambil daftar perangkat dari Backend
  const fetchPerangkat = async () => {
    setLoading(true);
    try {
      const response = await api.get('/perangkat-desa');
      setData(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data perangkat desa", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerangkat();
  }, []);

  const handleOpenCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`PERINGATAN!\n\nApakah Anda yakin ingin menghapus data "${nama}" beserta foto-fotonya secara permanen dari server?`)) {
      try {
        await api.delete(`/perangkat-desa/${id}`);
        fetchPerangkat(); // Perbarui tabel segera setelah dihapus
      } catch (error) {
        alert(error.response?.data?.message || 'Terjadi kesalahan saat menghapus data.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Perangkat Desa</h1>
          <p className="text-slate-500 mt-1">Kelola daftar struktur keanggotaan Pemerintahan Desa Girirejo.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-emerald-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> Tambah Data
        </button>
      </div>

      {/* Tabel Data Elegan */}
      <div className="bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-sm">
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider w-16">ID</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider w-24">Formal</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider w-24">Hover</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider">Informasi Lengkap</th>
                <th className="p-5 font-bold text-slate-500 uppercase tracking-wider text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-medium animate-pulse">Memuat data dari server...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 font-medium">Belum ada data perangkat desa. Klik tombol Tambah Data.</td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                    <td className="p-5 text-slate-500 font-medium">#{item.id}</td>
                    <td className="p-5">
                      <div className="w-14 h-14 rounded-xl bg-stone-200 overflow-hidden shadow-sm border border-stone-200">
                        {item.foto_awal_url ? (
                          <img src={`http://localhost:5001/uploads/${item.foto_awal_url}`} alt="Formal" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-[10px] text-slate-400">Kosong</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="w-14 h-14 rounded-xl bg-stone-200 overflow-hidden shadow-sm border-2 border-brand-accent/20">
                        {item.foto_hover_url ? (
                          <img src={`http://localhost:5001/uploads/${item.foto_hover_url}`} alt="Hover" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-[10px] text-slate-400">Kosong</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                        <div className="font-bold text-slate-800 text-lg mb-1">{item.nama_lengkap}</div>
                        <div className="text-brand-primary font-medium text-sm inline-flex items-center bg-emerald-50 px-2 py-0.5 rounded-md">{item.jabatan}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleOpenEdit(item)}
                          className="flex items-center justify-center p-2.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors shadow-sm"
                          title="Edit Data"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.nama_lengkap)}
                          className="flex items-center justify-center p-2.5 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl transition-colors shadow-sm"
                          title="Hapus Data Permanen"
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

      {/* Komponen Modal yang akan dirender jika isModalOpen bernilai true */}
      <PerangkatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPerangkat}
        initialData={editData}
      />
    </div>
  );
};

export default PerangkatDesa;
