const InvariantError = require('../../exceptions/InvariantError');
const AddCardsShufflePayloadSchema = require('./schema');

const ShuffledValidator = {
  validateShufflePayload: (payload) => {
    const validationResult = AddCardsShufflePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ShuffledValidator;
