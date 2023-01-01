const Joi = require('joi');

const PutCaseSchema = Joi.object({
  card_id: Joi.string().min(21).max(21).required(),
  case_number: Joi.number().integer().min(1).max(6).required(),
});

module.exports = PutCaseSchema;
