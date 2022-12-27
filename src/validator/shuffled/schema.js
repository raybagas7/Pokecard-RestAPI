const Joi = require('joi');

const AddCardsShufflePayloadSchema = Joi.object({
  cardsData: Joi.array()
    .items({
      id: Joi.string().min(16).max(16).required(),
      pokeid: Joi.number().allow(null).integer().required(),
      name: Joi.string().allow(null).required(),
      spritesNormal: Joi.string().allow(null).required(),
      spritesShiny: Joi.string().allow(null).required(),
      types: Joi.array()
        .allow(null)
        .items({
          slot: Joi.number().required(),
          type: Joi.object({
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
            url: Joi.string().required(),
          }),
        })
        .required(),
      stats: Joi.array()
        .items({
          base_stat: Joi.number().integer().required(),
          effort: Joi.number().integer().required(),
          stat: Joi.object({
            name: Joi.string().required(),
            url: Joi.string().required(),
          }),
        })
        .allow(null)
        .required(),
      speciesUrl: Joi.string().allow(null).required(),
      moves: Joi.array()
        .items({
          name: Joi.string().required(),
          url: Joi.string().required(),
        })
        .allow(null)
        .required(),
      animatedSpritesNormal: Joi.string().allow(null).required(),
      animatedSpritesShiny: Joi.string().allow(null).required(),
      attribute: Joi.string().valid('normal', 'shiny').allow(null).required(),
      choose: Joi.boolean().allow(null).required(),
    })
    .required(),
});

module.exports = AddCardsShufflePayloadSchema;
