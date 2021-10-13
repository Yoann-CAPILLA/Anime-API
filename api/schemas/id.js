const Joi = require("joi");

const schema = Joi.object({
  user_id: Joi.number().integer().min(1).required(),
});

module.exports = schema;
