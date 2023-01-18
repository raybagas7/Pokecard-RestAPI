const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  email: Joi.string()
    .email({
      tlds: true,
    })
    .required(),
  trainer_name: Joi.string().required(),
});

module.exports = UserPayloadSchema;
