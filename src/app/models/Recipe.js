const db = require('../../config/dbConnection');

module.exports = {
  getAllRecipes(callback) {
    const selectFromRecipes = `
    SELECT 
      recipes.* ,
      chefs.name as author
    FROM 
      recipes
    LEFT JOIN chefs ON chefs.id = recipes.chef_id
    ORDER BY recipes.created_at DESC;;
    `;
    db.query(selectFromRecipes, (err, results) => {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  },
  getRecipe(id, callback) {
    const selectRecipeFromRecipes = `
      SELECT *
      FROM recipes
      WHERE id = $1
    `;

    db.query(selectRecipeFromRecipes, [id], (err, results) => {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },
};
