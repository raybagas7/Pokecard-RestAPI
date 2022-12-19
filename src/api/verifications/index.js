const VerificationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'verifications',
  version: '1.0.0',
  register: async (server, { service }) => {
    const verificationsHandler = new VerificationsHandler(service);
    server.route(routes(verificationsHandler));
  },
};
