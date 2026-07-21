const visitorModel = require('../models/visitorModel');

const visitorController = {
  record: async (req, res) => {
    try {
      // Dapatkan IP dari header proxy (jika dibalik nginx) atau req.ip
      const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '127.0.0.1';
      // Ambil IP pertama jika berupa list (karena proxy berantai)
      const clientIp = ip.split(',')[0].trim();
      
      await visitorModel.recordVisit(clientIp);
      
      res.status(200).json({ success: true, message: 'Visit recorded' });
    } catch (error) {
      console.error('Error recording visit:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  getStats: async (req, res) => {
    try {
      const stats = await visitorModel.getStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting visitor stats:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

module.exports = visitorController;
