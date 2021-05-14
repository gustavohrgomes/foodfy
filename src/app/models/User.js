const db = require('../../config/dbConnection');
const { hash } = require('bcryptjs');

const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  all() {
    const sql = `
      SELECT * FROM users
      ORDER BY updated_at DESC
    `;

    return db.query(sql);
  },
  async findOne(filters) {
    let query = `SELECT * FROM users`;

    try {
      Object.keys(filters).map(key => {
        // WHERE | OR | AND
        query = `${query}
          ${key}
        `;

        Object.keys(filters[key]).map(field => {
          query = `${query} ${field} = '${filters[key][field]}'`;
        });
      });

      const results = await db.query(query);

      return results.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  async create(data) {
    try {
      const createUser = `
        INSERT INTO users (
          name,
          email,
          password,
          is_admin
        ) VALUES ($1, $2, $3, $4)
        RETURNING id;
      `;

      const encryptedPassword = await hash(data.password, 8);

      const values = [
        data.name,
        data.email,
        encryptedPassword,
        data.is_admin || false,
      ];

      const results = await db.query(createUser, values);
      return results.rows[0].id;
    } catch (error) {
      throw new Error(error);
    }
  },
  async update(id, fields) {
    let updateUser = 'UPDATE users SET';
    try {
      Object.keys(fields).map((key, index, array) => {
        if (index + 1 < array.length) {
          updateUser = `
            ${updateUser}
            ${key} = '${fields[key]}',
          `;
        } else {
          updateUser = `
            ${updateUser}
            ${key} = '${fields[key]}'
            WHERE id = ${id}
          `;
        }
      });

      await db.query(updateUser);
    } catch (error) {
      throw new Error(error);
    }
  },
  async delete(id) {
    try {
      let results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [
        id,
      ]);
      const recipes = results.rows;

      const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id));

      let promiseResults = await Promise.all(allFilesPromise);

      await db.query('DELETE FROM users WHERE id = $1', [id]);

      promiseResults.map(results => {
        results.rows.map(file => {
          try {
            File.delete(file.file_id);
          } catch (error) {
            throw new Error(error);
          }
        });
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
