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

const UserNewPasswordSchema = Joi.object({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = { UserPayloadSchema, UserNewPasswordSchema };
