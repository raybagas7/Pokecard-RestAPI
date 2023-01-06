const TradesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'trades',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const tradesHandler = new TradesHandler(service, validator);
    server.route(routes(tradesHandler));
  },
};
