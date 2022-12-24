const Joi = require('joi');

const AddCardByOwnerSchema = Joi.object({
  pokeball_amount: Joi.number().integer().min(0).required(),
  ultraball_amount: Joi.number().integer().min(0).required(),
  masterball_amount: Joi.number().integer().min(0).required(),
  creditId: Joi.string().min(23).max(23).required(),
  cardsData: Joi.array()
    .items({
      id: Joi.string().min(16).max(16).required(),
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
      move1: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
        accuracy: Joi.number().integer().allow(null).required(),
        power: Joi.number().integer().allow(null).required(),
        pp: Joi.number().integer().allow(null).required(),
        ailment: Joi.string().required(),
        type: Joi.string().required(),
      }).required(),
      move2: Joi.object({
        id: Joi.number().integer().required(),
        name: Joi.string().required(),
        accuracy: Joi.number().integer().allow(null).required(),
        power: Joi.number().integer().allow(null).required(),
        pp: Joi.number().integer().allow(null).required(),
        ailment: Joi.string().required(),
        type: Joi.string().required(),
      }).required(),
    })
    .required(),
});

module.exports = AddCardByOwnerSchema;
