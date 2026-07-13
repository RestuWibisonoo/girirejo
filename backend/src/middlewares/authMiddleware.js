const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: "error",
                message: "Akses ditolak. Token tidak valid atau tidak ditemukan."
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Simpan payload token ke dalam request agar bisa diakses controller
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Akses ditolak. Token sudah kedaluwarsa atau tidak valid."
        });
    }
};

module.exports = authMiddleware;
