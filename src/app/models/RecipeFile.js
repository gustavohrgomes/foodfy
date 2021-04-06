const db = require('../../config/dbConnection');

module.exports = {
  create({ recipe_id, file_id }) {
    try {
      const sql = `
        INSERT INTO recipe_files (
          recipe_id,
          file_id
        ) VALUES ($1, $2)
        RETURNING id
      `;

      const values = [recipe_id, file_id];

      return db.query(sql, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
};
