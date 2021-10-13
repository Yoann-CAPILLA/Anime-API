const Tag = require("../models/tag");

const controller = {
  getMainTags: async (req, res) => {
    try {
      const result = await Tag.findMain();

      res.json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  getOneTag: async (req, res) => {
    try {
      const tagId = parseInt(req.params.id);
      const result = await Tag.findOne(tagId);
      res.json(result);
    } catch (error) {
      res.status(404).json(error.message);
    }
  },

  getAllTags: async (req, res) => {
    try {
      const result = await Tag.findAll();
      res.json(result);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
};

module.exports = controller;
