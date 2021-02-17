const db = require('../../config/dbConnection');

module.exports = {
  getAllChefs(callback) {
    const selectFromChefs = `
      SELECT
        chefs.*,
        COUNT(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id;
    `;

    db.query(selectFromChefs, (err, results) => {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
};
