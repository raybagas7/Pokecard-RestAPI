require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const config = require('./utils/config');

// Users Api
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
const ClientError = require('./exceptions/ClientError');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
const credits = require('./api/credits');
const CreditsService = require('./services/postgres/CreditsService');
const CreditsValidator = require('./validator/credits');
const CardsService = require('./services/postgres/CardsService');
const cards = require('./api/cards');
const CardsValidator = require('./validator/cards');
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');
const VerificationsService = require('./services/postgres/VerificationsService');
const verifications = require('./api/verifications');
const ShowcasesService = require('./services/postgres/ShowcasesService');
const ShuffledService = require('./services/postgres/ShuffledService');
const shuffled = require('./api/shuffled');
const ShuffledValidator = require('./validator/shuffled');
const showcases = require('./api/showcases');
const ShowcasesValidator = require('./validator/showcases');

const init = async () => {
  const cardsService = new CardsService();
  const showcasesService = new ShowcasesService(cardsService);
  const shuffledService = new ShuffledService();
  const usersService = new UsersService(showcasesService, shuffledService);
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
