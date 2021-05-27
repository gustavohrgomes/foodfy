const db = require('../../config/dbConnection');
const fs = require('fs');

const Base = require('./Base');

Base.init({ table: 'files' });

module.exports = {
  ...Base,
  async deleteFile(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = result.rows[0];

      fs.unlinkSync(file.path);

      return db.query(`DELETE FROM files WHERE id = $1`, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
};
