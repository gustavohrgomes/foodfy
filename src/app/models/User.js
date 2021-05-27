const db = require('../../config/dbConnection');

const Base = require('./Base');

Base.init({ table: 'users' });

module.exports = {
  ...Base,
  async all() {
    const sql = `
      SELECT * FROM users
      ORDER BY updated_at DESC
    `;

    const results = await db.query(sql);
    return results.rows;
  },
};

// async create(data) {
//   try {
//     const createUser = `
//       INSERT INTO users (
//         name,
//         email,
//         password,
//         is_admin
//       ) VALUES ($1, $2, $3, $4)
//       RETURNING id;
//     `;

//     const encryptedPassword = await hash(data.password, 8);

//     const values = [
//       data.name,
//       data.email,
//       encryptedPassword,
//       data.is_admin || false,
//     ];

//     const results = await db.query(createUser, values);
//     return results.rows[0].id;
//   } catch (error) {
//     throw new Error(error);
//   }
// },
// async delete(id) {
//   try {
//     let results = await db.query('SELECT * FROM recipes WHERE user_id = $1', [
//       id,
//     ]);
//     const recipes = results.rows;

//     const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id));

//     let promiseResults = await Promise.all(allFilesPromise);

//     await db.query('DELETE FROM users WHERE id = $1', [id]);

//     promiseResults.map(results => {
//       results.rows.map(file => {
//         try {
//           File.delete(file.file_id);
//         } catch (error) {
//           throw new Error(error);
//         }
//       });
//     });
//   } catch (error) {
//     throw new Error(error);
//   }
// },
