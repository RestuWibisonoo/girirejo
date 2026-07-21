import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, MapPin, Tag } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet Default Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Click-to-Pick Map Component
const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

const PetaDesa = () => {
  const [activeTab, setActiveTab] = useState('lokasi'); // 'lokasi' | 'kategori'
  const [kategoriList, setKategoriList] = useState([]);
  const [lokasiList, setLokasiList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form States
  const [showLokasiModal, setShowLokasiModal] = useState(false);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Lokasi Form
  const [namaLokasi, setNamaLokasi] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [position, setPosition] = useState(null); // {lat, lng}
  const [foto, setFoto] = useState(null);

  // Kategori Form
  const [namaKategori, setNamaKategori] = useState('');
  const [ikonWarna, setIkonWarna] = useState('blue');

  // Default Center (Tegalrejo/Girirejo)
  const defaultCenter = [-7.4262, 110.3361];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [katRes, lokRes] = await Promise.all([
        api.get('/peta/kategori'),
        api.get('/peta/lokasi')
      ]);
      setKategoriList(katRes.data);
      setLokasiList(lokRes.data);
    } catch (error) {
      console.error(error);
      alert('Gagal mengambil data peta');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS LOKASI ---
  const handleSaveLokasi = async (e) => {
    e.preventDefault();
    if (!position) return alert('Silakan pilih lokasi di peta!');
    
    const formData = new FormData();
    formData.append('nama_lokasi', namaLokasi);
    formData.append('kategori_id', kategoriId);
    formData.append('deskripsi', deskripsi);
    formData.append('alamat', alamat);
    formData.append('latitude', position.lat);
    formData.append('longitude', position.lng);
    if (foto) formData.append('foto', foto);

    try {
      if (editId) {
        await api.put(`/peta/lokasi/${editId}`, formData);
      } else {
        await api.post('/peta/lokasi', formData);
      }
      setShowLokasiModal(false);
      resetLokasiForm();
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan lokasi');
    }
  };

  const handleDeleteLokasi = async (id) => {
    if (!window.confirm('Yakin ingin menghapus lokasi ini?')) return;
    try {
      await api.delete(`/peta/lokasi/${id}`);
      fetchData();
    } catch (error) {
      alert('Gagal menghapus');
    }
  };

  const openEditLokasi = (lok) => {
    setEditId(lok.id);
    setNamaLokasi(lok.nama_lokasi);
    setKategoriId(lok.kategori_id || '');
    setDeskripsi(lok.deskripsi || '');
    setAlamat(lok.alamat || '');
    setPosition({ lat: lok.latitude, lng: lok.longitude });
    setFoto(null);
    setShowLokasiModal(true);
  };

  const resetLokasiForm = () => {
    setEditId(null);
    setNamaLokasi('');
    setKategoriId('');
    setDeskripsi('');
    setAlamat('');
    setPosition(null);
    setFoto(null);
  };

  // --- HANDLERS KATEGORI ---
  const handleSaveKategori = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/peta/kategori/${editId}`, { nama_kategori: namaKategori, ikon_warna: ikonWarna });
      } else {
        await api.post('/peta/kategori', { nama_kategori: namaKategori, ikon_warna: ikonWarna });
      }
      setShowKategoriModal(false);
      resetKategoriForm();
      fetchData();
    } catch (error) {
      alert('Gagal menyimpan kategori');
    }
  };

  const handleDeleteKategori = async (id) => {
    if (!window.confirm('Hapus kategori ini? (Lokasi terkait akan kehilangan kategori)')) return;
    try {
      await api.delete(`/peta/kategori/${id}`);
      fetchData();
    } catch (error) {
      alert('Gagal menghapus');
    }
  };

  const openEditKategori = (kat) => {
    setEditId(kat.id);
    setNamaKategori(kat.nama_kategori);
    setIkonWarna(kat.ikon_warna);
    setShowKategoriModal(true);
  };

  const resetKategoriForm = () => {
    setEditId(null);
    setNamaKategori('');
    setIkonWarna('blue');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Peta Desa</h1>

      {/* TABS */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('lokasi')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            activeTab === 'lokasi' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 border'
          }`}
        >
          <MapPin size={18} /> Daftar Lokasi
        </button>
        <button
          onClick={() => setActiveTab('kategori')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            activeTab === 'kategori' ? 'bg-brand-primary text-white' : 'bg-white text-gray-600 border'
          }`}
        >
          <Tag size={18} /> Kategori Peta
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'lokasi' ? (
        <div>
          <button 
            onClick={() => { resetLokasiForm(); setShowLokasiModal(true); }}
            className="mb-4 bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
          >
            <Plus size={18} /> Tambah Lokasi
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">Nama Lokasi</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Koordinat</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {lokasiList.map(lok => (
                  <tr key={lok.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{lok.nama_lokasi}</td>
                    <td className="p-4 text-gray-600">
                      {lok.nama_kategori ? (
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">{lok.nama_kategori}</span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{lok.latitude}, {lok.longitude}</td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button onClick={() => openEditLokasi(lok)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteLokasi(lok.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lokasiList.length === 0 && <p className="p-6 text-center text-gray-500">Belum ada lokasi.</p>}
          </div>
        </div>
      ) : (
        <div>
          <button 
            onClick={() => { resetKategoriForm(); setShowKategoriModal(true); }}
            className="mb-4 bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700"
          >
            <Plus size={18} /> Tambah Kategori
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-2xl">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4">Nama Kategori</th>
                  <th className="p-4">Warna</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kategoriList.map(kat => (
                  <tr key={kat.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{kat.nama_kategori}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: kat.ikon_warna }}></div>
                        <span className="text-sm text-gray-600">{kat.ikon_warna}</span>
                      </div>
                    </td>
                    <td className="p-4 flex justify-center space-x-2">
                      <button onClick={() => openEditKategori(kat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                      <button onClick={() => handleDeleteKategori(kat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {kategoriList.length === 0 && <p className="p-6 text-center text-gray-500">Belum ada kategori.</p>}
          </div>
        </div>
      )}

      {/* MODAL LOKASI */}
      {showLokasiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">{editId ? 'Edit Lokasi' : 'Tambah Lokasi'}</h2>
              <button onClick={() => setShowLokasiModal(false)} className="text-gray-500 hover:text-gray-800"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveLokasi} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lokasi</label>
                  <input type="text" required value={namaLokasi} onChange={e => setNamaLokasi(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select value={kategoriId} onChange={e => setKategoriId(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-primary">
                    <option value="">Pilih Kategori...</option>
                    {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                  <textarea rows="3" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-primary"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <input type="text" value={alamat} onChange={e => setAlamat(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto Lokasi (Opsional)</label>
                  <input type="file" accept="image/*" onChange={e => setFoto(e.target.files[0])} className="w-full p-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <input type="text" required readOnly value={position?.lat || ''} className="w-full p-2 border rounded-lg bg-gray-50" placeholder="Klik pada peta..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <input type="text" required readOnly value={position?.lng || ''} className="w-full p-2 border rounded-lg bg-gray-50" placeholder="Klik pada peta..." />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col h-[500px] border rounded-xl overflow-hidden shadow-inner">
                <div className="bg-gray-100 p-3 text-sm text-gray-600 font-medium border-b flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" /> Silakan klik lokasi di peta ini
                </div>
                <MapContainer center={position || defaultCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>

              <div className="col-span-1 md:col-span-2 pt-4 border-t flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowLokasiModal(false)} className="px-5 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-5 py-2 bg-brand-primary text-white rounded-lg hover:bg-emerald-700">Simpan Lokasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KATEGORI */}
      {showKategoriModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{editId ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={() => setShowKategoriModal(false)} className="text-gray-500 hover:text-gray-800"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveKategori} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                <input type="text" required value={namaKategori} onChange={e => setNamaKategori(e.target.value)} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Warna Ikon (Hex/Nama)</label>
                <div className="flex gap-2">
                  <input type="color" value={ikonWarna.startsWith('#') ? ikonWarna : '#3b82f6'} onChange={e => setIkonWarna(e.target.value)} className="h-10 w-10 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" required value={ikonWarna} onChange={e => setIkonWarna(e.target.value)} className="w-full p-2 border rounded-lg flex-1" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowKategoriModal(false)} className="px-4 py-2 text-gray-600 border rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// X icon helper
const X = ({size}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default PetaDesa;
