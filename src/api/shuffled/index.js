const ShuffledHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'shuffled',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const shuffledHandler = new ShuffledHandler(service, validator);
    server.route(routes(shuffledHandler));
  },
};
