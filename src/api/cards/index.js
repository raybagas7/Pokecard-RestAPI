const CardsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'cards',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const cardsHandler = new CardsHandler(service, validator);
    server.route(routes(cardsHandler));
  },
};
