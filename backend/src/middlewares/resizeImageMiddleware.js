const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const processImage = async (file) => {
    // Hanya proses file gambar (abaikan PDF/Word dll)
    if (!file.mimetype.startsWith('image/')) return;

    const filePath = file.path;
    const tempPath = filePath + '-temp.webp';
    // Gunakan ekstensi .webp
    const newFilename = path.parse(file.filename).name + '.webp';
    const finalPath = path.join(file.destination, newFilename);

    try {
        await sharp(filePath)
            .resize({ 
                width: 800, // Batasi lebar maksimal 800px
                withoutEnlargement: true // Jangan perbesar jika foto aslinya kecil, dan JANGAN potong (preserve aspect ratio)
            })
            .webp({ quality: 80 }) // Kompresi ke format webp agar lebih ringan
            .toFile(tempPath);

        // Hapus file asli yang diupload (misal: jpg/png)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // Ubah nama file temp menjadi final
        fs.renameSync(tempPath, finalPath);

        // Update detail file di object request (req.file)
        file.path = finalPath;
        file.filename = newFilename;
        file.mimetype = 'image/webp';
    } catch (error) {
        console.error("Gagal melakukan resize gambar:", error);
        // Jika gagal resize, kita biarkan saja gambar aslinya
    }
};

const resizeImageMiddleware = async (req, res, next) => {
    if (!req.file && !req.files) return next();

    // Kasus upload.single() (contoh di UMKM)
    if (req.file) {
        await processImage(req.file);
    }

    // Kasus upload.fields() atau upload.array() (contoh di Publikasi & Perangkat)
    if (req.files) {
        if (Array.isArray(req.files)) {
            for (const file of req.files) {
                await processImage(file);
            }
        } else {
            // Bentuknya object (key = fieldname, value = array of files)
            for (const fieldname in req.files) {
                for (const file of req.files[fieldname]) {
                    await processImage(file);
                }
            }
        }
    }

    next();
};

module.exports = resizeImageMiddleware;
