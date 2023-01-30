const routes = (handler) => [
  {
    method: 'POST',
    path: '/offers',
    handler: handler.postOfferHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'DELETE',
    path: '/offers',
    handler: handler.deleteOfferHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/offers',
    handler: handler.getAllOfferListUserHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/offers/trader/{trader_card_id}',
    handler: handler.getOfferListTraderHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/offers/trader/accept',
    handler: handler.acceptAnOfferHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
