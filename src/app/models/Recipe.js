const db = require('../../config/dbConnection');

const { date } = require('../../lib/utils');

module.exports = {
  all(callback) {
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
  find(id, callback) {
    const selectRecipeFromRecipes = `
      SELECT 
        recipes.*,
        chefs.name AS author
      FROM recipes
      LEFT JOIN chefs on (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `;

    db.query(selectRecipeFromRecipes, [id], (err, results) => {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },
  findby(filter, callback) {
    const filterRecipe = `
      SELECT 
        recipes.*,
        chefs.name AS author
      FROM recipes
      LEFT JOIN chefs on (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY recipes.created_at
    `;

    db.query(filterRecipe, (err, results) => {
      if (err) throw `Database error! ${err}`;

      console.log(results.rows);
      callback(results.rows);
    });
  },
  chefSelectOptions(callback) {
    const chefs = `
      SELECT 
        id,
        name
      FROM chefs
    `;

    db.query(chefs, (err, results) => {
      if (err) throw `Database ${err}!`;

      callback(results.rows);
    });
  },
  create(recipe, callback) {
    const createRecipe = `
      INSERT INTO recipes (
        chef_id,
        title,
        image,
        ingredients,
        preparation,
        information
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      recipe.chef,
      recipe.title,
      recipe.image,
      recipe.ingredients,
      recipe.preparation,
      recipe.information,
    ];

    db.query(createRecipe, values, (err, results) => {
      if (err) throw `Database ${err}!`;

      callback(results.rows[0]);
    });
  },
  update(recipe, callback) {
    const updateRecipe = `
      UPDATE 
        recipes
      SET
        image=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5),
        chef_id=($6)
      WHERE id = $7
    `;

    const values = [
      recipe.image,
      recipe.title,
      recipe.ingredients,
      recipe.preparation,
      recipe.information,
      recipe.chef,
      recipe.id,
    ];

    db.query(updateRecipe, values, (err, results) => {
      if (err) throw `Database ${err}!`;

      callback();
    });
  },
  delete(id, callback) {
    const deleteRecipe = `
      DELETE FROM recipes
      WHERE id = $1
    `;

    db.query(deleteRecipe, [id], (err, results) => {
      if (err) throw `Database ${err}!`;

      callback();
    });
  },
  paginate(params) {
    const { filter, limit, offset, callback } = params;

    let query = '';
    filterquery = '';

    if (filter) {
      filterquery = `${query}
        WHERE recipes.title ILIKE '%${filter}%'
      `;
    }

    query = `${query}
      SELECT 
        recipes.*,
        chefs.name AS author
      FROM recipes
      LEFT JOIN chefs on (recipes.chef_id = chefs.id)
      ${filterquery}
      ORDER BY recipes.created_at
      LIMIT $1 OFFSET $2
    `;

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw `Database ${err}`;

      callback(results.rows);
    });
  },
};
