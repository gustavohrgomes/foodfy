const db = require('../../config/dbConnection');

const Base = require('./Base');

Base.init({ table: 'users' });

module.exports = {
  ...Base,
  async all() {
    const sql = `
      SELECT * FROM users
      ORDER BY updated_at DESC
    `;

    const results = await db.query(sql);
    return results.rows;
  },
};
