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
  getChefRecipes(id, callback) {
    const selectChefRecipes = `
      SELECT 
        recipes.*
      FROM 
        recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1;
    `;

    db.query(selectChefRecipes, [id], (err, results) => {
      if (err) throw `Database ${err}!`;

      callback(results.rows);
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
  find(id, callback) {
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
  update(chef, callback) {
    const updateChef = `
    UPDATE 
      chefs
    SET
      name=($1),
      avatar_url=($2)
    WHERE id = $3
    `;

    const values = [chef.name, chef.avatar_url, chef.id];

    db.query(updateChef, values, (err, results) => {
      if (err) throw `Database ${err}!`;

      callback();
    });
  },
  delete(id, callback) {
    const deleteChef = `
      DELETE FROM chefs 
      WHERE id = $1
    `;

    db.query(deleteChef, [id], (err, results) => {
      if (err) throw `Database ${err}!`;

      callback();
    });
  },
};
