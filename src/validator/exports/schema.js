const Joi = require('joi');

const ExportUserEmailPayloadSchema = Joi.object({
  targetEmail: Joi.string()
    .email({
      tlds: true,
    })
    .required(),
});

module.exports = ExportUserEmailPayloadSchema;
