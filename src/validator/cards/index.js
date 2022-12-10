const InvariantError = require('../../exceptions/InvariantError');
const AddCardByOwnerSchema = require('./schema');

const CardsValidator = {
  validateAddCardByOwnerPayload: (payload) => {
    const validationResult = AddCardByOwnerSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CardsValidator;
