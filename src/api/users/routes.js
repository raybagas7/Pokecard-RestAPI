const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/me',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
];

module.exports = routes;
