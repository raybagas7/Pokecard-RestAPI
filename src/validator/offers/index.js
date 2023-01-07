const InvariantError = require('../../exceptions/InvariantError');
const {
  addAnOfferSchema,
  deleteAnOfferSchema,
  acceptAnOfferSchema,
} = require('./schema');

const OffersValidator = {
  validateAddAnOfferPayload: (payload) => {
    const validationResult = addAnOfferSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAnOfferPayload: (payload) => {
    const validationResult = deleteAnOfferSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateAcceptAnOfferPayload: (payload) => {
    const validationResult = acceptAnOfferSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = OffersValidator;
