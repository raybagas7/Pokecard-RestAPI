const routes = (handler) => [
  {
    method: 'GET',
    path: '/verify/email/{userId}/{token}',
    handler: handler.getVerifyEmail,
  },
];

module.exports = routes;
