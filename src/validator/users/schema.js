const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  trainer_name: Joi.string().required(),
});

module.exports = UserPayloadSchema;
