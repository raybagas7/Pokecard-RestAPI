const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/email/verify',
    handler: handler.postExportVerifyEmailHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
  {
    method: 'POST',
    path: '/export/forgot/password',
    handler: handler.postExportForgotPasswordHandler,
  },
];

module.exports = routes;
