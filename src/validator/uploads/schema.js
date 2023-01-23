const Joi = require('joi');

const ImageHeaderSchema = Joi.object({
  'content-type': Joi.string().valid('image/jpeg', 'image/png').required(),
}).unknown();

module.exports = {
  ImageHeaderSchema,
};
