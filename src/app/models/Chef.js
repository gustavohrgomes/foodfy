const db = require('../../config/dbConnection');

module.exports = {
  all() {
    try {
      const selectChefsFrom = `
        SELECT
          chefs.*,
          COUNT(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id;
      `;

      return db.query(selectChefsFrom);
    } catch (error) {
      throw new Error(error);
    }
  },
  find(id) {
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

      return db.query(selectChefFrom, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
  getChefRecipes(id) {
    try {
      const selectChefRecipes = `
        SELECT 
          recipes.*
        FROM 
          recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1;
      `;

      return db.query(selectChefRecipes, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
  create(chef) {
    try {
      const createChef = `
        INSERT INTO chefs (
          name,
          file_id
        )
        VALUES ($1, $2)
        RETURNING id
      `;

      const queryValues = [chef.name, chef.file_id];

      return db.query(createChef, queryValues);
    } catch (error) {
      throw new Error(error);
    }
  },
  update(chef) {
    try {
      const updateChef = `
        UPDATE 
          chefs
        SET
          name=($1),
          avatar_url=($2)
        WHERE id = $3
      `;

      const values = [chef.name, chef.avatar_url, chef.id];

      return db.query(updateChef, values);
    } catch (error) {
      throw new Error(error);
    }
  },
  delete(id) {
    try {
      const deleteChef = `
        DELETE FROM chefs 
        WHERE id = $1
      `;

      return db.query(deleteChef, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
  files(id) {
    try {
      const sql = `
        SELECT chefs.*, files.name AS "avatar-img", files.path
        FROM chefs
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1
      `;

      return db.query(sql, [id]);
    } catch (error) {
      throw new Error(error);
    }
  },
};
