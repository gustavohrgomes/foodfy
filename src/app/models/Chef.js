const db = require('../../config/dbConnection');

const Base = require('./Base');

Base.init({ table: 'chefs' });

module.exports = {
  ...Base,
  async all() {
    try {
      const selectChefsFrom = `
        SELECT
          chefs.*,
          COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id;
      `;

      const results = await db.query(selectChefsFrom);
      return results.rows;
    } catch (error) {
      throw new Error(error);
    }
  },
  async find(id) {
    try {
      const selectChefFrom = `
        SELECT
          chefs.*,
          COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id;
      `;

      const results = await db.query(selectChefFrom, [id]);
      return results.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  async chefRecipes(id) {
    try {
      const selectChefRecipes = `
        SELECT 
          recipes.*
        FROM 
          recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        ORDER BY recipes.created_at DESC;
      `;

      const results = await db.query(selectChefRecipes, [id]);
      return results.rows;
    } catch (error) {
      throw new Error(error);
    }
  },
  async file(id) {
    try {
      const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      return results.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
};
