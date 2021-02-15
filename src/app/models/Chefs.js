const db = require('../../config/dbConnection');

module.exports = {
  getAllChefs(callback) {
    const selectFromChefs = `
      SELECT *
      FROM chefs
    `;

    db.query(selectFromChefs, (err, results) => {
      if (err) throw `Database error! ${err}`;

      console.log(results.rows);
      callback(results.rows);
    });
  },
};
