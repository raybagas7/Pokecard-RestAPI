const Joi = require('joi');

const PutWindowSchema = Joi.object({
  card_id: Joi.string().min(21).max(21).required(),
  window_number: Joi.number().integer().min(1).max(6).required(),
});

module.exports = PutWindowSchema;
