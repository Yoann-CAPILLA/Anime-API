const db = require("../database");
const { sortAnimes, sortRandom } = require("../services/sort");

class Tag {
  constructor(data = {}) {
    for (const prop in data) {
      this[prop] = data[prop];
    }
  }

  static async findOne(id) {
    const query = `SELECT * FROM one_tag WHERE id = $1`;
    const { rows } = await db.query(query, [id]);

    if (rows[0]) {
      sortAnimes(rows);
      return rows.map((tag) => new Tag(tag));
    } else {
      throw new Error(`No tag with id "${id}"`);
    }
  }

  static async findMain() {
    const query = `SELECT * FROM tags`;
    const { rows } = await db.query(query);
    sortRandom(rows);
    return rows.map((mainTag) => new Tag(mainTag));
  }

  static async findAll() {
    const query = `SELECT * FROM tag`;
    const { rows } = await db.query(query);
    return rows.map((tag) => new Tag(tag));
  }
}

module.exports = Tag;
