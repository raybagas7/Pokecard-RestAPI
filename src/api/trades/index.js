const TradesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'trades',
  version: '1.0.0',
  register: async (
    server,
    { tradesService, showcasesService, offersService, validator }
  ) => {
    const tradesHandler = new TradesHandler(
      tradesService,
      showcasesService,
      offersService,
      validator
    );
    server.route(routes(tradesHandler));
  },
};
