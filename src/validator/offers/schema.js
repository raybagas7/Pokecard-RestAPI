const Joi = require('joi');

const addAnOfferSchema = Joi.object({
  offerer_card_id: Joi.string().min(21).max(21).required(),
  trader_card_id: Joi.string().min(21).max(21).required(),
});

const deleteAnOfferSchema = Joi.object({
  offer_id: Joi.string().min(22).max(22).required(),
});

module.exports = { addAnOfferSchema, deleteAnOfferSchema };
