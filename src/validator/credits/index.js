const InvariantError = require('../../exceptions/InvariantError');
const PutPokeBallSchema = require('./schema');

const CreditsValidator = {
  validatePutPokeBallSchema: (payload) => {
    const validationResult = PutPokeBallSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CreditsValidator;
