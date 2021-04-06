const db = require('../../config/dbConnection');

module.exports = {
  all() {
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

      return db.query(selectFromRecipes);
    } catch (err) {
      throw new Error(err);
    }
  },
  find(id) {
    try {
      const selectRecipeFromRecipes = `
        SELECT 
          recipes.*,
          chefs.name AS author
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
      `;

      return db.query(selectRecipeFromRecipes, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
  findby(filter) {
    try {
      const filterRecipe = `
        SELECT 
          recipes.*,
          chefs.name AS author
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY recipes.created_at
      `;

      return db.query(filterRecipe);
    } catch (error) {
      throw new Error(error);
    }
  },
  create(recipe) {
    try {
      const createRecipe = `
        INSERT INTO recipes (
          chef_id,
          title,
          ingredients,
          preparation,
          information
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const values = [
        recipe.chef,
        recipe.title,
        recipe.ingredients,
        recipe.preparation,
        recipe.information,
      ];

      return db.query(createRecipe, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  update(recipe) {
    try {
      const updateRecipe = `
        UPDATE 
          recipes
        SET
          title=($1),
          ingredients=($2),
          preparation=($3),
          information=($4),
          chef_id=($5)
        WHERE id = $6
      `;

      const values = [
        recipe.title,
        recipe.ingredients,
        recipe.preparation,
        recipe.information,
        recipe.chef,
        recipe.id,
      ];

      return db.query(updateRecipe, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  delete(id) {
    try {
      const deleteRecipe = `
        DELETE FROM recipes
        WHERE id = $1
      `;

      return db.query(deleteRecipe, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
  paginate(params) {
    try {
      const { filter, limit, offset } = params;

      let query = '';
      let filterquery = '';
      let totalQuery = '(SELECT COUNT(*) FROM RECIPES) AS total';

      if (filter) {
        filterquery = `${query}
          WHERE recipes.title ILIKE '%${filter}%'
        `;

        totalQuery = `(
          SELECT COUNT(*) FROM RECIPES
          ${filterquery}
        ) AS total`;
      }

      query = `${query}
        SELECT 
          recipes.*,
          chefs.name AS author,
          ${totalQuery}
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        ${filterquery}
        ORDER BY recipes.created_at
        LIMIT $1 OFFSET $2
      `;

      return db.query(query, [limit, offset]);
    } catch (error) {
      throw new Error(error);
    }
  },
  files(id) {
    const sql = `
      SELECT recipe_files.*, files.name AS name, files.path AS path
      FROM recipe_files
      LEFT JOIN files ON (recipe_files.file_id = files.id)
      WHERE recipe_files.recipe_id = $1
    `;

    return db.query(sql, [id]);
  },
};
