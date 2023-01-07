const ShowcasesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'showcases',
  version: '1.0.0',
  register: async (server, { showcasesService, tradesService, validator }) => {
    const showcasesHandler = new ShowcasesHandler(
      showcasesService,
      tradesService,
      validator
    );
    server.route(routes(showcasesHandler));
  },
};
