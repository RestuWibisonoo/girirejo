import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, UploadCloud } from 'lucide-react';

const PerangkatModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({ nama_lengkap: '', jabatan: '' });
  const [fotoAwal, setFotoAwal] = useState(null);
  const [fotoHover, setFotoHover] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Jika initialData berubah (saat edit), isi form otomatis
  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_lengkap: initialData.nama_lengkap || '',
        jabatan: initialData.jabatan || ''
      });
      setFotoAwal(null);
      setFotoHover(null);
      setError('');
    } else {
      setFormData({ nama_lengkap: '', jabatan: '' });
      setFotoAwal(null);
      setFotoHover(null);
      setError('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('nama_lengkap', formData.nama_lengkap);
    data.append('jabatan', formData.jabatan);
    
    if (fotoAwal) data.append('foto_awal', fotoAwal);
    if (fotoHover) data.append('foto_hover', fotoHover);

    try {
      if (initialData) {
        // Mode Edit (PUT)
        await api.put(`/perangkat-desa/${initialData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Mode Buat Baru (POST)
        await api.post('/perangkat-desa', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess(); // Refresh data table di belakang
      onClose();   // Tutup modal
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data perangkat desa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Perangkat Desa' : 'Tambah Perangkat Baru'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium animate-pulse">
              {error}
            </div>
          )}

          <form id="perangkatForm" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                placeholder="Cth: Budi Santoso"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Jabatan <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required 
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                placeholder="Cth: Kepala Urusan Perencanaan"
                value={formData.jabatan}
                onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Upload Foto Formal */}
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center hover:border-brand-primary hover:bg-emerald-50 transition-colors relative cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFotoAwal(e.target.files[0])}
                  required={!initialData} 
                />
                <UploadCloud size={28} className="mx-auto text-slate-400 mb-3 group-hover:text-brand-primary transition-colors" />
                <p className="text-sm font-bold text-slate-700 group-hover:text-brand-primary">Foto Formal</p>
                {fotoAwal && <p className="text-[11px] text-brand-primary mt-1 truncate px-2 font-medium bg-emerald-100 rounded-full">{fotoAwal.name}</p>}
                {(!fotoAwal && initialData?.foto_awal_url) && <p className="text-[11px] text-slate-400 mt-1">Ganti file (Opsional)</p>}
                {(!fotoAwal && !initialData) && <p className="text-[11px] text-red-500 mt-1 font-medium">* Wajib Diisi</p>}
              </div>

              {/* Upload Foto Bebas */}
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center hover:border-brand-accent hover:bg-orange-50 transition-colors relative cursor-pointer group">
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setFotoHover(e.target.files[0])}
                  required={!initialData} 
                />
                <UploadCloud size={28} className="mx-auto text-slate-400 mb-3 group-hover:text-brand-accent transition-colors" />
                <p className="text-sm font-bold text-slate-700 group-hover:text-brand-accent">Foto Santai (Hover)</p>
                {fotoHover && <p className="text-[11px] text-brand-accent mt-1 truncate px-2 font-medium bg-orange-100 rounded-full">{fotoHover.name}</p>}
                {(!fotoHover && initialData?.foto_hover_url) && <p className="text-[11px] text-slate-400 mt-1">Ganti file (Opsional)</p>}
                {(!fotoHover && !initialData) && <p className="text-[11px] text-red-500 mt-1 font-medium">* Wajib Diisi</p>}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Modal */}
        <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-stone-200 transition-colors"
          >
            Batal
          </button>
          <button 
            form="perangkatForm"
            type="submit" 
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-emerald-800 shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PerangkatModal;
