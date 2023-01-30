const routes = (handler) => [
  {
    method: 'PUT',
    path: '/trades',
    handler: handler.updateWindowHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
  {
    method: 'GET',
    path: '/trades',
    handler: handler.getUserTradesHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/trades/remove',
    handler: handler.removeCardFromTradesWindow,
    options: {
      auth: 'pokecard_jwt',
    },
  },
];

module.exports = routes;
