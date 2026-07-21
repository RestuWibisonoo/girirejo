const db = require('../config/db');

const visitorModel = {
  recordVisit: async (ipAddress) => {
    try {
      const query = `
        INSERT IGNORE INTO visitor_logs (ip_address, visit_date) 
        VALUES (?, CURDATE())
      `;
      const [results] = await db.query(query, [ipAddress]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  getStats: async () => {
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM visitor_logs WHERE visit_date = CURDATE()) AS hari_ini,
          (SELECT COUNT(*) FROM visitor_logs WHERE MONTH(visit_date) = MONTH(CURDATE()) AND YEAR(visit_date) = YEAR(CURDATE())) AS bulan_ini,
          (SELECT COUNT(*) FROM visitor_logs WHERE YEAR(visit_date) = YEAR(CURDATE())) AS tahun_ini,
          (SELECT COUNT(*) FROM visitor_logs WHERE YEAR(visit_date) = YEAR(CURDATE()) - 1) AS tahun_kemarin
      `;
      const [results] = await db.query(query);
      return results[0] || {
        hari_ini: 0,
        bulan_ini: 0,
        tahun_ini: 0,
        tahun_kemarin: 0
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = visitorModel;

module.exports = visitorModel;
