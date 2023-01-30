const routes = (handler) => [
  {
    method: 'POST',
    path: '/cards',
    handler: handler.postCardByOwnerHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/cards',
    handler: handler.getCardByOwnerHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/cards/{elementType}',
    handler: handler.getCardByElementTypeHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
