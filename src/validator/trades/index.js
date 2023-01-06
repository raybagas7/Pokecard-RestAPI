const InvariantError = require('../../exceptions/InvariantError');
const PutWindowSchema = require('./schema');

const TradesValidator = {
  validatePutWindowPayload: (payload) => {
    const validationResult = PutWindowSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = TradesValidator;
