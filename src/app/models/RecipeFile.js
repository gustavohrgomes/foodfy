const db = require('../../config/dbConnection');

module.exports = {
  create({ recipe_id, file_id }) {
    const sql = `
      INSERT INTO recipe_files (
        recipe_id,
        file_id
      ) VALUES ($1, $2)
      RETURNING id
    `;

    const values = [recipe_id, file_id];

    return db.query(sql, values);
  },
};
