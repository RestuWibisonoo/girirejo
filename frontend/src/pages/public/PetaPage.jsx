import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../../services/api';
import { MapPin, Navigation, Tag } from 'lucide-react';

// Reset Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icon Generator based on Category Color
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const PetaPage = () => {
  const [lokasiList, setLokasiList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [filterKat, setFilterKat] = useState('all');
  const [search, setSearch] = useState('');
  
  const defaultCenter = [-7.4262, 110.3361];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lokRes, katRes] = await Promise.all([
          api.get('/peta/lokasi'),
          api.get('/peta/kategori')
        ]);
        setLokasiList(lokRes.data);
        setKategoriList(katRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const filteredLokasi = lokasiList.filter(lok => {
    const matchKategori = filterKat === 'all' || lok.kategori_id === parseInt(filterKat);
    const matchSearch = lok.nama_lokasi.toLowerCase().includes(search.toLowerCase());
    return matchKategori && matchSearch;
  });

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
      {/* Sidebar Filter */}
      <div className="w-full md:w-80 bg-white border-r border-stone-200 p-6 flex flex-col h-full overflow-y-auto shadow-xl z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin className="text-brand-primary" /> Peta Desa
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cari Lokasi</label>
          <input 
            type="text" 
            placeholder="Ketik nama lokasi..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-shadow"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter Kategori</label>
          <div className="space-y-2">
            <button
              onClick={() => setFilterKat('all')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${filterKat === 'all' ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'hover:bg-stone-50 text-gray-600'}`}
            >
              <Tag size={18} /> Semua Kategori
            </button>
            {kategoriList.map(kat => (
              <button
                key={kat.id}
                onClick={() => setFilterKat(kat.id.toString())}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3 ${filterKat === kat.id.toString() ? 'bg-brand-primary/10 text-brand-primary font-bold' : 'hover:bg-stone-50 text-gray-600'}`}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: kat.ikon_warna }}></div>
                {kat.nama_kategori}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-stone-100">
          <p className="text-xs text-gray-400 text-center">Menampilkan {filteredLokasi.length} lokasi</p>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 h-[50vh] md:h-full relative bg-stone-100">
        <MapContainer center={defaultCenter} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredLokasi.map(lok => (
            <Marker 
              key={lok.id} 
              position={[lok.latitude, lok.longitude]}
              icon={lok.ikon_warna ? createCustomIcon(lok.ikon_warna) : new L.Icon.Default()}
            >
              <Popup className="custom-popup">
                <div className="w-48 md:w-56">
                  {lok.foto_url && (
                    <img src={import.meta.env.VITE_API_URL?.replace('/api', '') + lok.foto_url} alt={lok.nama_lokasi} className="w-full h-32 object-cover rounded-t-lg mb-2" />
                  )}
                  <div className={lok.foto_url ? 'px-2 pb-2' : ''}>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{lok.nama_lokasi}</h3>
                    {lok.nama_kategori && (
                      <span className="inline-block px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-full mb-2 font-medium">
                        {lok.nama_kategori}
                      </span>
                    )}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{lok.deskripsi}</p>
                    <p className="text-xs text-gray-500 mb-3 flex gap-1"><MapPin size={14} className="shrink-0" /> {lok.alamat}</p>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lok.latitude},${lok.longitude}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Navigation size={16} /> Rute ke Sini
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PetaPage;
