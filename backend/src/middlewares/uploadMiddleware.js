const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Buat folder uploads jika belum ada untuk menghindari error
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi tempat penyimpanan dan nama file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Nama file unik dengan timestamp dan random string
        const randomString = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${randomString}${ext}`);
    }
});

// Filter memperbolehkan gambar dan dokumen (PDF/Word)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung! Hanya Gambar (JPG/PNG/WEBP), PDF, atau Word yang diperbolehkan.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024 // Maksimal ukuran 20MB (Nanti akan dikompres oleh sharp)
    }
});

module.exports = upload;
