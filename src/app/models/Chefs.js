const db = require('../../config/dbConnection');

module.exports = {
  getAllChefs(callback) {
    const selectFromChefs = `
      SELECT 
        chefs.*
      FROM chefs
    `;

    db.query(selectFromChefs, (err, results) => {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
};
