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
  {
    method: 'GET',
    path: '/offers/trader/{trader_card_id}',
    handler: handler.getOfferListTraderHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/offers/trader/accept',
    handler: handler.acceptAnOfferHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
];

module.exports = routes;
