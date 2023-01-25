const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(5).max(15).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string()
    .email({
      tlds: true,
    })
    .required(),
  trainer_name: Joi.string().max(15).required(),
});

const UserNewPasswordSchema = Joi.object({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = { UserPayloadSchema, UserNewPasswordSchema };
