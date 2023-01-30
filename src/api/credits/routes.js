const routes = (handler) => [
  {
    method: 'POST',
    path: '/credits',
    handler: handler.postCreditHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/credits',
    handler: handler.getCreditHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/credits/totalcards',
    handler: handler.getCreditAndTotalCardsHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/credits/pokeball/reduce',
    handler: handler.putReducePokeBallHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/credits/coin/pokemon/shuffle',
    handler: handler.putPokemonShuffleWithCoinHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/credits/coin/add',
    handler: handler.putCreditCoinHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/credits/claim/daily',
    handler: handler.putCreditDailyClaimHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
