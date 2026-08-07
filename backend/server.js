const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Ekspos folder foto

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const desaProfileRoutes = require('./src/routes/desaProfileRoutes');
const perangkatRoutes = require('./src/routes/perangkatRoutes');
const kategoriUmkmRoutes = require('./src/routes/kategoriUmkmRoutes');
const umkmRoutes = require('./src/routes/umkmRoutes');
const publikasiRoutes = require('./src/routes/publikasiRoutes');
const visitorRoutes = require('./src/routes/visitorRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

// Test Route
app.get('/', (req, res) => {
    res.json({ status: "success", message: "API Desa Girirejo berjalan lancar!" });
});

// Gunakan Routes
app.use('/api/auth', authRoutes);
app.use('/api/desa-profile', desaProfileRoutes);
app.use('/api/perangkat-desa', perangkatRoutes);
app.use('/api/kategori-umkm', kategoriUmkmRoutes);
app.use('/api/umkm', umkmRoutes);
app.use('/api/publikasi', publikasiRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/admin', adminRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});