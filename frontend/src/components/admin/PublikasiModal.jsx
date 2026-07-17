import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, UploadCloud, FileText } from 'lucide-react';

const JENIS_OPTIONS = ['Berita', 'Kegiatan', 'Akuntabilitas'];

const PublikasiModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    judul: '',
    jenis: 'Berita',
    ringkasan: '',
    tanggal: new Date().toISOString().split('T')[0],
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [filePdf, setFilePdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        judul: initialData.judul || '',
        jenis: initialData.jenis || 'Berita',
        ringkasan: initialData.ringkasan || '',
        tanggal: initialData.tanggal
          ? new Date(initialData.tanggal).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        judul: '',
        jenis: 'Berita',
        ringkasan: '',
        tanggal: new Date().toISOString().split('T')[0],
      });
    }
    setThumbnail(null);
    setFilePdf(null);
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('tipe', formData.jenis.toLowerCase());
    data.append('konten', formData.ringkasan);
    if (thumbnail) data.append('gambar', thumbnail);
    if (filePdf) data.append('lampiran', filePdf);

    try {
      if (initialData) {
        await api.put(`/publikasi/${initialData.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/publikasi', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan data publikasi.');
    } finally {
      setLoading(false);
    }
  };

  const jenisColor = {
    Berita: 'focus:ring-indigo-500',
    Kegiatan: 'focus:ring-purple-500',
    Akuntabilitas: 'focus:ring-brand-primary',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-xl">
              <FileText size={20} className="text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Publikasi' : 'Tambah Publikasi Baru'}
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

          <form id="publikasiForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Judul */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm"
                placeholder="Cth: Laporan Realisasi APBDes 2025"
                value={formData.judul}
                onChange={handleChange}
              />
            </div>

            {/* Jenis & Tanggal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Jenis Publikasi <span className="text-red-500">*</span>
                </label>
                <select
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm appearance-none cursor-pointer"
                >
                  {JENIS_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tanggal Publikasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="tanggal"
                  required
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm cursor-pointer"
                  value={formData.tanggal}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Ringkasan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ringkasan / Isi</label>
              <textarea
                name="ringkasan"
                rows={4}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-sm resize-none"
                placeholder="Tuliskan ringkasan atau isi dari publikasi ini..."
                value={formData.ringkasan}
                onChange={handleChange}
              />
            </div>

            {/* Upload Files */}
            <div className="grid grid-cols-2 gap-4">
              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail (Gambar)</label>
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center hover:border-brand-primary hover:bg-emerald-50 transition-colors relative cursor-pointer group h-full min-h-[100px] flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={e => setThumbnail(e.target.files[0])}
                  />
                  <UploadCloud size={24} className="text-slate-400 mb-2 group-hover:text-brand-primary transition-colors" />
                  {thumbnail
                    ? <p className="text-[11px] text-brand-primary font-bold truncate max-w-full px-2">{thumbnail.name}</p>
                    : <p className="text-[11px] text-slate-400">{initialData?.thumbnail_url ? 'Ganti thumbnail' : 'Upload gambar'}</p>
                  }
                </div>
              </div>

              {/* File PDF */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">File Dokumen (PDF)</label>
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors relative cursor-pointer group h-full min-h-[100px] flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={e => setFilePdf(e.target.files[0])}
                  />
                  <FileText size={24} className="text-slate-400 mb-2 group-hover:text-indigo-500 transition-colors" />
                  {filePdf
                    ? <p className="text-[11px] text-indigo-600 font-bold truncate max-w-full px-2">{filePdf.name}</p>
                    : <p className="text-[11px] text-slate-400">{initialData?.file_url ? 'Ganti PDF' : 'Upload PDF (opsional)'}</p>
                  }
                </div>
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
            form="publikasiForm"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-emerald-800 shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Terbitkan'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublikasiModal;
