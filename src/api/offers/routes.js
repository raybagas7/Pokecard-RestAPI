const routes = (handler) => [
  {
    method: 'POST',
    path: '/offers',
    handler: handler.postOfferHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/offers',
    handler: handler.deleteOfferHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
];

module.exports = routes;
