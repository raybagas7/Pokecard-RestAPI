require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const config = require('./utils/config');

// Users Api
const users = require('./api/users');
const UsersService = require('./services/postgrest/UsersService');
const UsersValidator = require('./validator/users');
const ClientError = require('./exceptions/ClientError');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgrest/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
const credits = require('./api/credits');
const CreditsService = require('./services/postgrest/CreditsService');
const CreditsValidator = require('./validator/credits');
const CardsService = require('./services/postgrest/CardsService');
const cards = require('./api/cards');
const CardsValidator = require('./validator/cards');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const creditsService = new CreditsService();
  const cardsService = new CardsService();

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
        service: cardsService,
        validator: CardsValidator,
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
