const OffersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'offers',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const offersHander = new OffersHandler(service, validator);
    server.route(routes(offersHander));
  },
};
