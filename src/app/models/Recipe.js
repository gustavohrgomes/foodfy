const db = require('../../config/dbConnection');

const Base = require('./Base');

Base.init({ table: 'recipes' });

module.exports = {
  ...Base,
  async all() {
    try {
      const selectFromRecipes = `
        SELECT 
          recipes.* ,
          chefs.name as author
        FROM 
          recipes
        LEFT JOIN chefs ON chefs.id = recipes.chef_id
        ORDER BY recipes.created_at DESC;
        `;

      const results = await db.query(selectFromRecipes);
      return results.rows;
    } catch (err) {
      throw new Error(err);
    }
  },
  async find(id) {
    try {
      const selectRecipeFromRecipes = `
        SELECT 
          recipes.*,
          chefs.name AS author
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `;

      const results = await db.query(selectRecipeFromRecipes, [id]);
      return results.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  async recipes(params) {
    try {
      const { filter, limit, offset } = params;

      let query = '';
      let filterquery = '';
      let totalQuery = `(SELECT count(*) FROM recipes) AS total`;

      if (filter) {
        filterquery = `${query}
          WHERE recipes.title ILIKE '%${filter}%'
        `;
      }

      query = `${query}
        SELECT 
          recipes.*,
          ${totalQuery},
          chefs.name AS author
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        ${filterquery}
        ORDER BY ${filter ? 'recipes.updated_at' : 'recipes.created_at'} DESC
        LIMIT $1 OFFSET $2
      `;

      const results = await db.query(query, [limit, offset]);
      return results.rows;
    } catch (error) {
      throw new Error(error);
    }
  },
  async files(id) {
    try {
      const sql = `
        SELECT recipe_files.*, files.name AS name, files.path AS path
        FROM recipe_files
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
      `;

      const results = await db.query(sql, [id]);
      return results.rows;
    } catch (error) {
      throw new Error(error);
    }
  },
};
