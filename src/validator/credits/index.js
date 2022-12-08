const InvariantError = require('../../exceptions/InvariantError');
const {
  PutPokeBallSchema,
  PutPokemonShuffleWithCoinSchema,
  PutCreditCoinSchema,
} = require('./schema');

const CreditsValidator = {
  validatePutPokeBallPayload: (payload) => {
    const validationResult = PutPokeBallSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutPokemonShuffleWithCoinPayload: (payload) => {
    const validationResult = PutPokemonShuffleWithCoinSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutCreditCoinSchemaPayload: (payload) => {
    const validationResult = PutCreditCoinSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CreditsValidator;
