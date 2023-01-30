const routes = (handler) => [
  {
    method: 'PUT',
    path: '/showcases',
    handler: handler.updateCaseHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/showcases',
    handler: handler.getUserShowcasesHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
