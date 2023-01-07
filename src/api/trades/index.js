const TradesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'trades',
  version: '1.0.0',
  register: async (server, { tradesService, showcasesService, validator }) => {
    const tradesHandler = new TradesHandler(
      tradesService,
      showcasesService,
      validator
    );
    server.route(routes(tradesHandler));
  },
};
