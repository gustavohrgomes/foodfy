const db = require('../../config/dbConnection');

const Base = {
  init({ table }) {
    if (!table) throw new Error('Invalid params');

    this.table = table;

    return this;
  },
  async findOne(filters) {
    let query = `SELECT * FROM ${this.table}`;

    try {
      Object.keys(filters).map(key => {
        query += ` ${key}`;

        Object.keys(filters[key]).map(field => {
          query += ` ${field} = '${filters[key][field]}'`;
        });
      });

      const results = await db.query(query);
      return results.rows[0];
    } catch (error) {
      throw new Error(error);
    }
  },
  async create(fields) {
    try {
      let keys = [];
      let values = [];

      Object.keys(fields).map(key => {
        keys.push(`${key}`);
        values.push(`'${fields[key]}'`);
      });

      const insert = `
        INSERT INTO ${this.table} (${keys.join(',')})
        VALUES (${values.join(',')})
        RETURNING id;
      `;

      const results = await db.query(insert);
      return results.rows[0].id;
    } catch (error) {
      throw new Error(error);
    }
  },
  update(id, fields) {
    try {
      let values = [];

      Object.keys(fields).map(key => {
        const line = `${key} = '${fields[key]}'`;
        values.push(line);
      });

      const update = `
        UPDATE ${this.table}
        SET ${values.join(',')}
        WHERE id = ${id};
      `;

      return db.query(update);
    } catch (error) {
      throw new Error(error);
    }
  },
  delete(field) {
    let exclude;

    Object.keys(field).map(key => {
      exclude = `${key} = '${field[key]}'`;
    });

    return db.query(`DELETE FROM ${this.table} WHERE ${exclude}`);
  },
};

module.exports = Base;
