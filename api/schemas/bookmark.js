const Joi = require("joi");

const schema = Joi.object({
  user_id: Joi.number().integer().required(),
  anime_id: Joi.number().integer().required(),
  progression: Joi.number().integer(),
  bc_id: Joi.number().integer().min(1).max(6),
});

module.exports = schema;
