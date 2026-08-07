import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Shield, Plus, Trash2, UserPlus, X } from 'lucide-react';

const ManajemenAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_lengkap: '',
    role: 'admin_desa'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Check if user is superadmin
    if (localStorage.getItem('adminRole') !== 'superadmin') {
        navigate('/admin');
        return;
    }
    fetchAdmins();
  }, [navigate]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin');
      setAdmins(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      await api.post('/admin', formData);
      setShowForm(false);
      setFormData({ username: '', password: '', nama_lengkap: '', role: 'admin_desa' });
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal membuat admin baru.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus admin ${nama}?`)) {
      try {
        await api.delete(`/admin/${id}`);
        fetchAdmins();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus admin.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="text-brand-primary" /> Manajemen Akses
          </h2>
          <p className="text-slate-500 mt-1">Kelola akun admin yang memiliki akses ke panel ini.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-brand-primary hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-md font-medium"
        >
          {showForm ? <X size={20} /> : <UserPlus size={20} />}
          {showForm ? 'Batal' : 'Tambah Admin'}
        </button>
      </div>

      {/* Form Tambah Admin */}
      {showForm && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Buat Akun Admin Baru</h3>
          {formError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">
              {formError}
            </div>
          )}
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Budi Santoso" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="budisantoso" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary" placeholder="Minimal 6 karakter" minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Peran (Role)</label>
              <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary">
                <option value="admin_desa">Admin Biasa</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button type="submit" disabled={formLoading} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-70">
                {formLoading ? 'Menyimpan...' : 'Simpan Akun'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Admin */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 animate-pulse">Memuat data...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 font-medium">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-sm font-semibold text-slate-600">
                  <th className="p-4 pl-6">ID</th>
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Peran (Role)</th>
                  <th className="p-4 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-400">#{admin.id}</td>
                    <td className="p-4 font-semibold text-slate-800">{admin.nama_lengkap}</td>
                    <td className="p-4 text-slate-500 font-mono text-sm">{admin.username}</td>
                    <td className="p-4">
                      {admin.role === 'superadmin' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          Super Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Admin Biasa
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {admin.username !== 'admin' && ( // Prevent deleting the main superadmin visually
                        <button
                          onClick={() => handleDelete(admin.id, admin.nama_lengkap)}
                          className="inline-flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default ManajemenAdmin;
