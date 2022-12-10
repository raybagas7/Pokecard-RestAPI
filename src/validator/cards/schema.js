const Joi = require('joi');

const AddCardByOwnerSchema = Joi.object({
  cardsData: Joi.array()
    .items({
      poke_id: Joi.number().integer().required(),
      name: Joi.string().required(),
      attribute: Joi.string().valid('normal', 'shiny').required(),
      legendary: Joi.boolean().required(),
      types: Joi.array()
        .items({
          name: Joi.string()
            .valid(
              'Bug',
              'Dark',
              'Dragon',
              'Electric',
              'Fairy',
              'Fighting',
              'Fire',
              'Flying',
              'Ghost',
              'Grass',
              'Ground',
              'Ice',
              'Normal',
              'Poison',
              'Psychic',
              'Rock',
              'Steel',
              'Water'
            )
            .insensitive()
            .required(),
        })
        .required(),
      stats: Joi.array()
        .items({
          base_stat: Joi.number().integer().required(),
          effort: Joi.number().integer().required(),
          name: Joi.string().required(),
        })
        .required(),
    })
    .required(),
});

module.exports = AddCardByOwnerSchema;
