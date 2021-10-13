const db = require("../database");
const { sortRelations } = require("../services/sort");

class Anime {
  constructor(data = {}) {
    for (const prop in data) {
      this[prop] = data[prop];
    }
  }

  static async findOne(id) {
    const query = `SELECT * FROM animes WHERE id = $1`;
    const { rows } = await db.query(query, [id]);

    if (rows[0]) {
      sortRelations(rows);
      return rows.map((anime) => new Anime(anime));
    } else {
      throw new Error(`No anime with id "${id}"`);
    }
  }

  static async findAll(limit) {
    let query = `SELECT * FROM animes`;
    if (limit) {
      query = query + ` LIMIT $1`;
      const { rows } = await db.query(query, [limit]);
      sortRelations(rows);
      return rows.map((anime) => new Anime(anime));
    } else {
      const { rows } = await db.query(query);
      sortRelations(rows);
      return rows.map((anime) => new Anime(anime));
    }
  }

  static async search(query) {
    let dbquery = `SELECT DISTINCT id, title, type, status, episodes, year, season, picture FROM (
            SELECT *, unnest(synonyms) synonym
            FROM animes) x`;
    const values = [];
    let propCount = 0;

    for (const prop in query) {

      if (query[prop]) {

        if (propCount) {
          if (prop.toLowerCase() === "minyear") {
            values.push(query[prop]);
            dbquery = dbquery + ` AND year >= $${values.length}`;
          } else if (prop.toLowerCase() === "maxyear") {
            values.push(query[prop]);
            dbquery = dbquery + ` AND year <= $${values.length}`;
          } else if (prop.toLowerCase() === "minepisodes") {
            values.push(query[prop]);
            dbquery = dbquery + ` AND episodes >= $${values.length}`;
          } else if (prop.toLowerCase() === "maxepisodes") {
            values.push(query[prop]);
            dbquery = dbquery + ` AND episodes <= $${values.length}::integer`;
          } else if (
            prop.toLowerCase() === "status" ||
            prop.toLowerCase() === "type"
          ) {
            values.push(query[prop]);
            dbquery = dbquery + ` AND ${prop} ILIKE $${values.length}`;
          } else {
            query[prop] = "%" + query[prop] + "%";
            values.push(query[prop]);
            dbquery =
              dbquery +
              ` AND (${prop} ILIKE $${values.length} OR synonym ILIKE $${values.length})`;
          }
        } else {
          if (prop.toLowerCase() === "minyear") {
            values.push(query[prop]);
            dbquery = dbquery + ` WHERE year >= $${values.length}`;
            propCount++;
          } else if (prop.toLowerCase() === "maxyear") {
            values.push(query[prop]);
            dbquery = dbquery + ` WHERE year <= $${values.length}`;
            propCount++;
          } else if (prop.toLowerCase() === "minepisodes") {
            values.push(query[prop]);
            dbquery = dbquery + ` WHERE episodes >= $${values.length}`;
            propCount++;
          } else if (prop.toLowerCase() === "maxepisodes") {
            values.push(query[prop]);
            dbquery = dbquery + ` WHERE episodes <= $${values.length}`;
            propCount++;
          } else if (
            prop.toLowerCase() === "status" ||
            prop.toLowerCase() === "type"
          ) {
            values.push(query[prop]);
            dbquery = dbquery + ` WHERE ${prop} ILIKE $${values.length}`;
            propCount++;
          } else {
            query[prop] = "%" + query[prop] + "%";
            values.push(query[prop]);
            dbquery =
              dbquery +
              ` WHERE (${prop} ILIKE $${values.length} OR synonym ILIKE $${values.length})`;
            propCount++;
          }
        }
      }
    }
    dbquery = dbquery + ` ORDER BY year DESC NULLS LAST`;

    const { rows } = await db.query(dbquery, values);
    if (rows) {
      return rows.map((result) => new Anime(result));
    } else {
      throw new Error(
        `Error with your SQL request. Initial request : ${dbquery}`
      );
    }
  }
}

module.exports = Anime;
