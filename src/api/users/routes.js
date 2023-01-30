const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getRandomUser,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/users/me',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/users/{search_id}',
    handler: handler.getUserInformationBySearchId,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/users/password/change',
    handler: handler.changeUserPasswordHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
