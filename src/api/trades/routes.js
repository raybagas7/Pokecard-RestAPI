const routes = (handler) => [
  {
    method: 'PUT',
    path: '/trades',
    handler: handler.updateWindowHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/trades',
    handler: handler.getUserTradesHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/trades/remove',
    handler: handler.removeCardFromTradesWindow,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
