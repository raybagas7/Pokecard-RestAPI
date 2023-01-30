const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/email/verify',
    handler: handler.postExportVerifyEmailHandler,
    options: {
      auth: 'pokecard_jwt',
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'POST',
    path: '/export/forgot/password',
    handler: handler.postExportForgotPasswordHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
