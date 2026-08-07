import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Simpan token JWT dan nama admin ke localStorage browser
        localStorage.setItem('token', token);
        localStorage.setItem('adminName', user.nama_lengkap);
        localStorage.setItem('adminRole', user.role);
        
        // Redirect sukses ke dashboard admin
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Koneksi ke server gagal. Pastikan Backend menyala.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border border-stone-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-brand-primary mb-4">
             <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Panel Admin</h1>
          <p className="text-slate-500">Desa Girirejo</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium text-center border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                placeholder="Masukkan password rahasia"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-4 bg-brand-primary hover:bg-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
          >
            {isLoading ? 'Sedang Memeriksa...' : 'Login Sekarang'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
