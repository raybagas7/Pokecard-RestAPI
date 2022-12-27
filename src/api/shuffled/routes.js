const routes = (handler) => [
  {
    method: 'PUT',
    path: '/shuffle/card',
    handler: handler.updateShuffledCardsHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
  {
    method: 'GET',
    path: '/shuffle/card',
    handler: handler.getShuffledCardsHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
];

module.exports = routes;
