const db = require('../../config/dbConnection');

module.exports = {
  async findOne(filters) {
    let query = `
      SELECT * FROM users
    `;

    try {
      Object.keys(filters).map(key => {
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
};
