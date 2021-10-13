const Anime = require("../models/anime");

const controller = {
  getOne: async (req, res) => {
    try {
      const animeId = parseInt(req.params.id);
      const result = await Anime.findOne(animeId);
      res.json(result);
    } catch (error) {
      res.status(404).json(error.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit);
      const result = await Anime.findAll(limit);
      res.json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  search: async (req, res) => {
    try {
      const query = {
        title: undefined,
        minepisodes: undefined,
        maxepisodes: undefined,
        minyear: undefined,
        maxyear: undefined,
        type: undefined,
        status: undefined,
        season: undefined,
      };
      for (const prop in query) {
        if (req.query.hasOwnProperty(prop)) {
          query[prop] = req.query[prop];
        }
      }

      const result = await Anime.search(query);

      res.json(result);
    } catch (error) {
      res.status(404).json(error.message);
    }
  },
};

module.exports = controller;
