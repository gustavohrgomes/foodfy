const db = require('../../config/dbConnection');

module.exports = {
  create({ filename, path }) {
    const sql = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `;

    const values = [filename, path];

    return db.query(sql, values);
  },
};
