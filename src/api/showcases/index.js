const ShowcasesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'showcases',
  version: '1.0.0',
  register: async (
    server,
    { showcasesService, tradesService, offersService, validator }
  ) => {
    const showcasesHandler = new ShowcasesHandler(
      showcasesService,
      tradesService,
      offersService,
      validator
    );
    server.route(routes(showcasesHandler));
  },
};
