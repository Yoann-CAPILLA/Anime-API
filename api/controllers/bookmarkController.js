const Bookmark = require("../models/bookmark.js");

const controller = {
  getBookmark: async (req, res) => {
    try {
      const id = parseInt(req.body.user_id);
      const result = await Bookmark.findOne(id);

      res.json(result);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },

  setBookmark: async (req, res) => {
    try {
      const bookmark = new Bookmark(req.body);

      await bookmark.save();

      res.status(200).json(bookmark);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },

  deleteBookmark: async (req, res) => {
    try {
      const bookmark = new Bookmark(req.body);
      const result = await bookmark.delete();

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error.message);
    }
  },
};

module.exports = controller;
