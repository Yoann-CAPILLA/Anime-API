const db = require("../database");

class User {
  constructor(data = {}) {
    for (const prop in data) {
      this[prop] = data[prop];
    }
  }

  static async findByEmail(email) {
    const query = `SELECT * FROM "user" WHERE email = $1`;
    const { rows } = await db.query(query, [email]);

    if (rows[0]) {
      return new User(rows[0]);
    } else {
      return null;
    }
  }

  static async findOne(id) {
    const query = `SELECT * FROM "user" WHERE id = $1`;
    const { rows } = await db.query(query, [id]);

    if (rows[0]) {
      return new User(rows[0]);
    } else {
      return null;
    }
  }

  async save() {
    if (this.id) {
      await db.query("SELECT * FROM update_user($1);", [this]);
    } else {
      const { rows } = await db.query("SELECT * FROM new_user($1);", [this]);

      for (const prop in rows[0]) {
        this[prop] = rows[0][prop];
      }

      delete this.password;

      return this;
    }
  }

  async delete() {
    if (this.id) {
      await db.query('DELETE FROM "user" WHERE id = $1', [this.id]);
    }
  }
}

module.exports = User;
