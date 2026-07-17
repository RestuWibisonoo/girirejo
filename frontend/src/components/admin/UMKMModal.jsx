import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, UploadCloud, Store } from 'lucide-react';

const CATEGORIES = ['Makanan', 'Minuman', 'Kerajinan', 'Pertanian', 'Jasa', 'Fashion', 'Lainnya'];

const UMKMModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    nama_usaha: '',
    kategori: 'Makanan',
    deskripsi: '',
    no_wa: '',
    link_gmaps: '',
  });
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset & isi form saat initialData berubah
  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_usaha: initialData.nama_usaha || '',
        kategori: initialData.kategori || 'Makanan',
        deskripsi: initialData.deskripsi || '',
        no_wa: initialData.no_wa || '',
        link_gmaps: initialData.link_gmaps || '',
      });
    } else {
      setFormData({ nama_usaha: '', kategori: 'Makanan', deskripsi: '', no_wa: '', link_gmaps: '' });
    }
    setFoto(null);
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (foto) data.append('foto', foto);

    try {
      if (initialData) {
        await api.put(`/umkm/${initialData.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/umkm', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data UMKM.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <Store size={20} className="text-brand-accent" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Data UMKM' : 'Tambah UMKM Baru'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-5 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium animate-pulse">
              {error}
            </div>
          )}

          <form id="umkmForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Usaha */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Usaha <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_usaha"
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm"
                placeholder="Cth: Keripik Singkong Bu Sari"
                value={formData.nama_usaha}
                onChange={handleChange}
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm appearance-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Produk</label>
              <textarea
                name="deskripsi"
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm resize-none"
                placeholder="Ceritakan produk atau layanan usaha ini..."
                value={formData.deskripsi}
                onChange={handleChange}
              />
            </div>

            {/* Nomor WA & Maps */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nomor WhatsApp</label>
                <input
                  type="text"
                  name="no_wa"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-sm"
                  placeholder="Cth: 08123456789"
                  value={formData.no_wa}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Link Google Maps</label>
                <input
                  type="url"
                  name="link_gmaps"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm"
                  placeholder="https://maps.google.com/..."
                  value={formData.link_gmaps}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Upload Foto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Foto Produk</label>
              <div className="border-2 border-dashed border-stone-200 rounded-xl p-5 text-center hover:border-brand-accent hover:bg-orange-50 transition-colors relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={e => setFoto(e.target.files[0])}
                  required={!initialData}
                />
                <UploadCloud size={28} className="mx-auto text-slate-400 mb-2 group-hover:text-brand-accent transition-colors" />
                {foto
                  ? <p className="text-sm text-brand-accent font-bold">{foto.name}</p>
                  : initialData?.foto_url
                    ? <p className="text-sm text-slate-500">Foto sudah ada. Upload baru untuk mengganti (opsional).</p>
                    : <p className="text-sm text-slate-500">Klik atau seret foto produk ke sini <span className="text-red-500 font-bold">*</span></p>
                }
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-100 flex justify-end gap-3 bg-stone-50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-stone-200 transition-colors">
            Batal
          </button>
          <button
            form="umkmForm"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-accent text-white font-bold hover:bg-orange-600 shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UMKMModal;
