import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PerangkatModal from '../../components/admin/PerangkatModal';
import { Plus, Edit2, Trash2, UploadCloud, CheckCircle } from 'lucide-react';

const PerangkatDesa = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Kontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // State Profil (untuk foto bersama)
  const [profile, setProfile] = useState(null);
  const [fotoBersama, setFotoBersama] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Mengambil daftar perangkat dari Backend
  const fetchPerangkat = async () => {
    setLoading(true);
    try {
      const response = await api.get('/perangkat-desa');
      setData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Gagal mengambil data perangkat desa", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/desa-profile');
      if (response.data.data) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil profil desa", error);
    }
  };

  useEffect(() => {
    fetchPerangkat();
    fetchProfile();
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

  const handleUploadFotoBersama = async () => {
    if (!fotoBersama) return;
    
    setUploadingProfile(true);
    const formData = new FormData();
    formData.append('nama_desa', profile?.nama_desa || 'Girirejo');
    formData.append('foto_bersama', fotoBersama);

    try {
      await api.put('/desa-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess(true);
      fetchProfile();
      setFotoBersama(null);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error("Gagal mengupload foto bersama", error);
      alert("Gagal mengupload foto bersama.");
    } finally {
      setUploadingProfile(false);
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

      {/* Bagian Foto Bersama */}
      <div className="bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Foto Bersama Perangkat Desa</h2>
          <p className="text-sm text-slate-500 mb-4">Unggah foto ini untuk ditampilkan memanjang di bagian paling atas Beranda publik perangkat desa.</p>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFotoBersama(e.target.files[0])}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-brand-primary hover:file:bg-emerald-100"
            />
            <button 
              onClick={handleUploadFotoBersama}
              disabled={!fotoBersama || uploadingProfile}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${!fotoBersama ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-brand-accent text-white hover:bg-orange-600 shadow-md'}`}
            >
              {uploadingProfile ? 'Mengunggah...' : uploadSuccess ? <><CheckCircle size={18} /> Berhasil</> : <><UploadCloud size={18} /> Simpan Foto</>}
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-[16/9] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shrink-0 relative">
          {profile?.foto_bersama_url ? (
            <img src={`${import.meta.env.VITE_UPLOAD_URL || '/uploads'}/${profile.foto_bersama_url}`} alt="Foto Bersama" className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 font-medium">Belum ada foto</span>
          )}
        </div>
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
                <>
                  {/* Helper to render rows */}
                  {(() => {
                    const renderRows = (groupData) => {
                      return groupData.map((item) => (
                        <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                          <td className="p-5 text-slate-500 font-medium">#{item.id}</td>
                          <td className="p-5">
                            <div className="w-14 h-14 rounded-xl bg-stone-200 overflow-hidden shadow-sm border border-stone-200">
                              {item.foto_awal_url ? (
                                <img src={`${import.meta.env.VITE_UPLOAD_URL || '/uploads'}/${item.foto_awal_url}`} alt="Formal" className="w-full h-full object-cover" />
                              ) : (
                                <span className="flex items-center justify-center w-full h-full text-[10px] text-slate-400">Kosong</span>
                              )}
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="w-14 h-14 rounded-xl bg-stone-200 overflow-hidden shadow-sm border-2 border-brand-accent/20">
                              {item.foto_hover_url ? (
                                <img src={`${import.meta.env.VITE_UPLOAD_URL || '/uploads'}/${item.foto_hover_url}`} alt="Hover" className="w-full h-full object-cover" />
                              ) : (
                                <span className="flex items-center justify-center w-full h-full text-[10px] text-slate-400">Kosong</span>
                              )}
                            </div>
                          </td>
                          <td className="p-5">
                              <div className="font-bold text-slate-800 text-lg mb-1">{item.nama_lengkap}</div>
                              <div className="text-brand-primary font-medium text-sm inline-flex items-center bg-emerald-50 px-2 py-0.5 rounded-md mr-2">{item.jabatan}</div>
                              {item.nip && <div className="text-slate-500 font-medium text-sm inline-flex items-center bg-slate-100 px-2 py-0.5 rounded-md">NIP: {item.nip}</div>}
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
                      ));
                    };

                    const kades = data.filter(d => d.urutan_tampil === 1);
                    const sekdes = data.filter(d => d.urutan_tampil === 2);
                    const kaur = data.filter(d => d.urutan_tampil >= 3 && d.urutan_tampil <= 5);
                    const kasi = data.filter(d => d.urutan_tampil >= 6 && d.urutan_tampil <= 8);
                    const kadus = data.filter(d => d.urutan_tampil >= 9);

                    return (
                      <>
                        {kades.length > 0 && (
                          <tr><td colSpan="5" className="px-5 py-3 bg-stone-100 text-slate-700 font-bold text-sm border-b border-stone-200">Kepala Desa</td></tr>
                        )}
                        {renderRows(kades)}

                        {sekdes.length > 0 && (
                          <tr><td colSpan="5" className="px-5 py-3 bg-stone-100 text-slate-700 font-bold text-sm border-b border-stone-200">Sekretaris Desa</td></tr>
                        )}
                        {renderRows(sekdes)}

                        {kaur.length > 0 && (
                          <tr><td colSpan="5" className="px-5 py-3 bg-stone-100 text-slate-700 font-bold text-sm border-b border-stone-200">Urusan Sekretariat (Kaur)</td></tr>
                        )}
                        {renderRows(kaur)}

                        {kasi.length > 0 && (
                          <tr><td colSpan="5" className="px-5 py-3 bg-stone-100 text-slate-700 font-bold text-sm border-b border-stone-200">Pelaksana Teknis (Kasi)</td></tr>
                        )}
                        {renderRows(kasi)}

                        {kadus.length > 0 && (
                          <tr><td colSpan="5" className="px-5 py-3 bg-stone-100 text-slate-700 font-bold text-sm border-b border-stone-200">Pelaksana Kewilayahan (Kepala Dusun)</td></tr>
                        )}
                        {renderRows(kadus)}
                      </>
                    );
                  })()}
                </>
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
