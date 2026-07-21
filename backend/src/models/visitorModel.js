const db = require('../config/database');

const visitorModel = {
  recordVisit: (ipAddress) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT IGNORE INTO visitor_logs (ip_address, visit_date) 
        VALUES (?, CURDATE())
      `;
      db.query(query, [ipAddress], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  getStats: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM visitor_logs WHERE visit_date = CURDATE()) AS hari_ini,
          (SELECT COUNT(*) FROM visitor_logs WHERE MONTH(visit_date) = MONTH(CURDATE()) AND YEAR(visit_date) = YEAR(CURDATE())) AS bulan_ini,
          (SELECT COUNT(*) FROM visitor_logs WHERE YEAR(visit_date) = YEAR(CURDATE())) AS tahun_ini,
          (SELECT COUNT(*) FROM visitor_logs WHERE YEAR(visit_date) = YEAR(CURDATE()) - 1) AS tahun_kemarin
      `;
      db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results[0] || {
          hari_ini: 0,
          bulan_ini: 0,
          tahun_ini: 0,
          tahun_kemarin: 0
        });
      });
    });
  }
};

module.exports = visitorModel;
