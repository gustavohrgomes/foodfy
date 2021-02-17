const db = require('../../config/dbConnection');
const { date } = require('../../lib/utils');

module.exports = {
  getAllChefs(callback) {
    const selectChefsFrom = `
      SELECT
        chefs.*,
        COUNT(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id;
    `;

    db.query(selectChefsFrom, (err, results) => {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
  getChef(id, callback) {
    const selectChefFrom = `
      SELECT
        chefs.*,
        COUNT(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id;
    `;

    db.query(selectChefFrom, [id], (err, results) => {
      if (err) throw `Database ${err}!`;

      callback(results.rows[0]);
    });
  },
  create(chef, callback) {
    const createChef = `
      INSERT INTO chefs (
        name,
        avatar_url
      )
      VALUES ($1, $2)
      RETURNING id
    `;

    const queryValues = [chef.name, chef.avatar_url];

    db.query(createChef, queryValues, (err, results) => {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },
};
