const routes = (handler) => [
  {
    method: 'GET',
    path: '/verify/email/{userId}/{token}',
    handler: handler.getVerifyEmail,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
