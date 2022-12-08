const Joi = require('joi');

const PutPokeBallSchema = Joi.object({
  pokeball_amount: Joi.number().integer().min(0).max(10).required(),
  ultraball_amount: Joi.number().integer().min(0).max(10).required(),
  masterball_amount: Joi.number().integer().min(0).max(10).required(),
  creditId: Joi.string().required(),
});

const PutPokemonShuffleWithCoinSchema = Joi.object({
  creditId: Joi.string().required(),
});

const PutCreditCoinSchema = Joi.object({
  creditId: Joi.string().required(),
});

module.exports = {
  PutPokeBallSchema,
  PutPokemonShuffleWithCoinSchema,
  PutCreditCoinSchema,
};
