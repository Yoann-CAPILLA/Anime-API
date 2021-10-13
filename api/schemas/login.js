const Joi = require("joi");

const schema = Joi.object({
  password: Joi.string().min(8).max(20).required().label("Password"),
  email: Joi.string()
    .pattern(
      /^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      { name: "email" }
    )
    .required(),
});

module.exports = schema;
