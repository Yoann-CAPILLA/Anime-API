const db = require("../database");
const { sortBookmarksRelations } = require("../services/sort");
const getFrequentTags = require("../services/suggestion");

class Bookmark {
  constructor(data = {}) {
    for (const prop in data) {
      this[prop] = data[prop];
    }
  }

  static async findOne(id) {
    const query = `SELECT * FROM bookmarks WHERE id = $1`;
    const { rows } = await db.query(query, [id]);

    if (rows[0].favorites[0].id !== null) {
      const suggestionTags = getFrequentTags(rows[0].favorites);

      let result = "";
      let cpt = 0;

      do {
        result = await db.query("SELECT * FROM suggestion($1, $2);", [
          suggestionTags,
          5 - cpt,
        ]);
        cpt++;
      } while (result.rows.length < 1);

      const suggestions = [];
      const favoriteIds = [];

      for (const favorite of rows[0].favorites) {
        favoriteIds.push(favorite.id);
      }

      for (const anime of result.rows) {
        if (favoriteIds.includes(anime.id)) {
          continue;
        }

        suggestions.push(anime);
      }

      rows[0].suggestion = suggestions;
    }

    sortBookmarksRelations(rows[0]);
    return rows.map((bookmark) => new Bookmark(bookmark));
  }

  async save() {
    const query = `SELECT * FROM user_has_anime WHERE user_id = $1 AND anime_id = $2`;
    const result = await db.query(query, [this.user_id, this.anime_id]);
    //TODO: Attente nb episode front pour checked progression max
    if (result.rows[0]) {
      if (!this.progression && this.progression !== 0) {
        this.progression = result.rows[0].progression;
      }

      if (!this.bc_id) {
        this.bc_id = result.rows[0].bc_id;
      }

      await db.query("SELECT * FROM update_bookmark($1);", [this]);
    } else {
      if (!this.progression) {
        this.progression = 0;
      }

      if (!this.bc_id) {
        this.bc_id = 1;
      }

      await db.query("SELECT * FROM new_bookmark($1);", [this]);
    }
  }

  async delete() {
    const query = `SELECT * FROM user_has_anime WHERE user_id = $1 AND anime_id = $2`;
    const result = await db.query(query, [this.user_id, this.anime_id]);

    if (result.rows[0]) {
      await db.query(
        "DELETE FROM user_has_anime WHERE user_id = $1 AND anime_id = $2",
        [this.user_id, this.anime_id]
      );
      return "Bookmark deleted!";
    } else {
      return "Bookmark not found!";
    }
  }
}

module.exports = Bookmark;
