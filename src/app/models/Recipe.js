const db = require('../../config/dbConnection');

module.exports = {
  getAllRecipes(callback) {
    const selectFromRecipes = `
    SELECT 
      recipes.* ,
      chefs.name as author
    FROM 
      recipes
    LEFT JOIN chefs ON chefs.id = recipes.chef_id;
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

      console.log(results.rows[0]);
      callback(results.rows[0]);
    });
  },
};
