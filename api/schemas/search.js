const Joi = require("joi");

const schema = Joi.object({
  title: Joi.string(),
  minepisodes: Joi.string().pattern(/^[0-9]+$/, { name: "numbers" }),
  maxepisodes: Joi.string().pattern(/^[0-9]+$/, { name: "numbers" }),
  minyear: Joi.string().pattern(/^[12][09][0-9]{2}$/, { name: "year" }),
  maxyear: Joi.string().pattern(/^[12][09][0-9]{2}$/, { name: "year" }),
  type: Joi.string(),
  status: Joi.string(),
  season: Joi.string(),
});

module.exports = schema;
