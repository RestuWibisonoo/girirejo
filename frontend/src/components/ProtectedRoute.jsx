import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Jika tidak ada token JWT, paksa user kembali ke halaman login
    return <Navigate to="/admin/login" replace />;
  }

  // Jika ada token, izinkan masuk ke halaman anak (Outlet) yang dilindungi
  return <Outlet />;
};

export default ProtectedRoute;
