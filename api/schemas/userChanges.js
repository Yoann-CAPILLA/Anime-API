const Joi = require("joi");

const schema = Joi.object({
  user_id: Joi.number().integer().required(),
  username: Joi.string(),
  previous_password: Joi.string()
    .min(8)
    .max(20)
    .label("Previous password")
    .when("password", { is: Joi.exist(), then: Joi.required() }),
  password: Joi.string().min(8).max(20).label("Password"),
  passwordConfirm: Joi.any()
    .equal(Joi.ref("password"))
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" })
    .when("password", { is: Joi.exist(), then: Joi.required() }),
  email: Joi.string().pattern(
    /^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    { name: "email" }
  ),
  avatar_url: Joi.string(),
  gender: Joi.number(),
});

module.exports = schema;
