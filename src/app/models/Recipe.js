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
};
