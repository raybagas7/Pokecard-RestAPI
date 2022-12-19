const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/email/verify',
    handler: handler.postExportVerifyEmailHandler,
    options: {
      auth: 'pokecard_jwt',
    },
  },
];

module.exports = routes;
