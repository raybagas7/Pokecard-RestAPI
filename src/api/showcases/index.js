const ShowcasesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'showcases',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const showcasesHandler = new ShowcasesHandler(service, validator);
    server.route(routes(showcasesHandler));
  },
};
