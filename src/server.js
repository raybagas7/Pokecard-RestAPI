require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const config = require('./utils/config');
const ClientError = require('./exceptions/ClientError');

//users API
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
//authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
//credits API
const credits = require('./api/credits');
const CreditsService = require('./services/postgres/CreditsService');
const CreditsValidator = require('./validator/credits');
//cards API
const CardsService = require('./services/postgres/CardsService');
const cards = require('./api/cards');
const CardsValidator = require('./validator/cards');
//exports API
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');
//verifications API
const VerificationsService = require('./services/postgres/VerificationsService');
const verifications = require('./api/verifications');
//showcases API
const ShowcasesService = require('./services/postgres/ShowcasesService');
const showcases = require('./api/showcases');
const ShowcasesValidator = require('./validator/showcases');
//shuffled API
const ShuffledService = require('./services/postgres/ShuffledService');
const shuffled = require('./api/shuffled');
const ShuffledValidator = require('./validator/shuffled');
//trades API
const TradesService = require('./services/postgres/TradesService');
const trades = require('./api/trades');
const TradesValidator = require('./validator/trades');
const OffersService = require('./services/postgres/OffersService');
const offers = require('./api/offers');
const OffersValidator = require('./validator/offers');

const init = async () => {
  const cardsService = new CardsService();
  const tradesService = new TradesService(cardsService);
  const offersService = new OffersService(cardsService);
  const showcasesService = new ShowcasesService(cardsService);
  const shuffledService = new ShuffledService();
  const usersService = new UsersService(
    showcasesService,
    shuffledService,
    tradesService
  );
  const authenticationsService = new AuthenticationsService();
  const creditsService = new CreditsService(usersService);
  const verificationsService = new VerificationsService(usersService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Tambah plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // Authentications Strategy
  server.auth.strategy('pokecard_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: credits,
      options: {
        service: creditsService,
        validator: CreditsValidator,
      },
    },
    {
      plugin: cards,
      options: {
        creditsService,
        cardsService,
        validator: CardsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        usersService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: verifications,
      options: {
        service: verificationsService,
      },
    },
    {
      plugin: shuffled,
      options: {
        service: shuffledService,
        validator: ShuffledValidator,
      },
    },
    {
      plugin: showcases,
      options: {
        service: showcasesService,
        validator: ShowcasesValidator,
      },
    },
    {
      plugin: trades,
      options: {
        service: tradesService,
        validator: TradesValidator,
      },
    },
    {
      plugin: offers,
      options: {
        service: offersService,
        validator: OffersValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Something happened to our server',
      });

      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running in ${server.info.uri}`);
};

init();
