import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Halaman Publik
import HomePage from './pages/public/HomePage';
import UMKMPage from './pages/public/UMKMPage';
import UMKMDetailPage from './pages/public/UMKMDetailPage';
import PublikasiPage from './pages/public/PublikasiPage';
import PublikasiDetailPage from './pages/public/PublikasiDetailPage';
// Halaman Admin
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PerangkatDesa from './pages/admin/PerangkatDesa';
import UMKM from './pages/admin/UMKM';
import Publikasi from './pages/admin/Publikasi';
import ManajemenAdmin from './pages/admin/ManajemenAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/umkm" element={<UMKMPage />} />
          <Route path="/umkm/:id" element={<UMKMDetailPage />} />
          <Route path="/publikasi" element={<PublikasiPage />} />
          <Route path="/publikasi/:slug" element={<PublikasiDetailPage />} />
        </Route>

        {/* Rute Autentikasi Admin */}
        <Route path="/admin/login" element={<Login />} />

        {/* Rute Terproteksi Admin (Membutuhkan JWT) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="perangkat" element={<PerangkatDesa />} />
            <Route path="umkm" element={<UMKM />} />
            <Route path="publikasi" element={<Publikasi />} />
            <Route path="pengguna" element={<ManajemenAdmin />} />
          </Route>
        </Route>

        {/* Redirect halaman tak ditemukan kembali ke beranda */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
