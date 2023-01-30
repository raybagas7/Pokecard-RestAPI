const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, usersService, validator }) => {
    const exportsHandler = new ExportsHandler(
      producerService,
      usersService,
      validator
    );
    server.route(routes(exportsHandler));
  },
};
