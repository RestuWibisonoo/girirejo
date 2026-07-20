import React from 'react';

const PerangkatCard = ({ perangkat }) => {
  // Gunakan placeholder foto jika tidak ada dari database
  const fotoAwal = perangkat.foto_awal_url 
    ? `${import.meta.env.VITE_UPLOAD_URL || '/uploads'}/${perangkat.foto_awal_url}` 
    : 'https://placehold.co/400x500/e2e8f0/475569?text=Foto+Formal';
    
  const fotoHover = perangkat.foto_hover_url 
    ? `${import.meta.env.VITE_UPLOAD_URL || '/uploads'}/${perangkat.foto_hover_url}` 
    : 'https://placehold.co/400x500/047857/ffffff?text=Foto+Bebas';

  return (
    <div className="flex flex-col items-center">
      <div className="relative group overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 w-full max-w-[280px] aspect-[4/5] bg-stone-100 mb-4 cursor-pointer">
        {/* Gambar statis/formal (hitam putih, akan memudar saat hover) */}
        <img 
            src={fotoAwal} 
            className="absolute z-10 inset-0 w-full h-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:opacity-0" 
            alt={`Foto formal ${perangkat.nama_lengkap}`} 
        />
        {/* Gambar interaktif/santai (akan muncul perlahan tanpa zoom saat hover) */}
        <img 
            src={fotoHover} 
            className="absolute z-0 inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out" 
            alt={`Foto santai ${perangkat.nama_lengkap}`} 
        />
      </div>
      
      <div className="text-center px-2">
        <h3 className="text-lg font-bold text-slate-800">{perangkat.nama_lengkap}</h3>
        <p className="text-brand-primary font-medium">{perangkat.jabatan}</p>
      </div>
    </div>
  );
};

export default PerangkatCard;
