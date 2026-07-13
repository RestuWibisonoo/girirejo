import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PerangkatDesa from './pages/admin/PerangkatDesa';

// Halaman Placeholder Publik
const Home = () => <div className="py-24 text-center text-4xl font-bold text-slate-800">Profil Desa Girirejo</div>;
const UMKM = () => <div className="py-24 text-center text-4xl font-bold text-slate-800">Katalog UMKM Desa</div>;
const Publikasi = () => <div className="py-24 text-center text-4xl font-bold text-slate-800">Berita & Transparansi</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/umkm" element={<UMKM />} />
          <Route path="/publikasi" element={<Publikasi />} />
        </Route>

        {/* Rute Autentikasi Admin */}
        <Route path="/admin/login" element={<Login />} />

        {/* Rute Terproteksi Admin (Membutuhkan JWT) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="perangkat" element={<PerangkatDesa />} />
            {/* Nanti diisi route /umkm, dan /publikasi versi admin */}
          </Route>
        </Route>
        
        {/* Redirect halaman tak ditemukan kembali ke beranda */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
