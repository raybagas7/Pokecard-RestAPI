const InvariantError = require('../../exceptions/InvariantError');
const PutCaseSchema = require('./schema');

const ShowcasesValidator = {
  validatePutCasePayload: (payload) => {
    const validationResult = PutCaseSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ShowcasesValidator;
