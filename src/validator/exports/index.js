const InvariantError = require('../../exceptions/InvariantError');
const ExportUserEmailPayloadSchema = require('./schema');

const ExportsValidator = {
  validateExportUserEmailPayload: (payload) => {
    const validationResult = ExportUserEmailPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
