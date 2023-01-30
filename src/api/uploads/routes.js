const routes = (handler) => [
  {
    method: 'POST',
    path: '/users/profile/picture',
    handler: handler.postUploadPPHandler,
    options: {
      auth: 'pokecard_jwt',
      payload: {
        maxBytes: 512000,
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
