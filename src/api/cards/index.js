const CardsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'cards',
  version: '1.0.0',
  register: async (server, { creditsService, cardsService, validator }) => {
    const cardsHandler = new CardsHandler(
      creditsService,
      cardsService,
      validator
    );
    server.route(routes(cardsHandler));
  },
};
