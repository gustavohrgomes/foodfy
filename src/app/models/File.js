const db = require('../../config/dbConnection');
const fs = require('fs');

module.exports = {
  create({ filename, path }) {
    try {
      const sql = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `;

      const values = [filename, path];

      return db.query(sql, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  async delete(id) {
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
