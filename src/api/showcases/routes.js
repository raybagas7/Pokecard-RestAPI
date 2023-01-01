const routes = (handler) => [
  {
    method: 'PUT',
    path: '/showcases',
    handler: handler.updateCaseHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
  {
    method: 'GET',
    path: '/showcases',
    handler: handler.getUserShowcasesHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
];

module.exports = routes;
