const CreditsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'credits',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const creditsHandler = new CreditsHandler(service, validator);
    server.route(routes(creditsHandler));
  },
};
