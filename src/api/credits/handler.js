const autoBind = require('auto-bind');

class CreditsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postCreditHandler(request, h) {
    const { id: ownerId } = request.auth.credentials;

    const creditId = await this._service.addNewCredit(ownerId);

    const response = h.response({
      status: 'success',
      message: 'Credit created',
      data: {
        creditId,
      },
    });

    response.code(201);
    return response;
  }

  async putReducePokeBallHandler(request) {
    this._validator.validatePutPokeBallPayload(request.payload);

    const { pokeball_amount, ultraball_amount, masterball_amount, creditId } =
      request.payload;
    const { id: ownerId } = request.auth.credentials;

    const pokeBall = await this._service.reducePokeBall(
      pokeball_amount,
      ultraball_amount,
      masterball_amount,
      creditId,
      ownerId
    );

    return {
      status: 'success',
      message: 'PokeBall Reduced',
      data: {
        pokeBall,
      },
    };
  }

  async putPokemonShuffleWithCoinHandler(request) {
    this._validator.validatePutPokemonShuffleWithCoinPayload(request.payload);
    const { creditId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    const coinAmount = await this._service.shufflePokemonWithCoin(
      creditId,
      ownerId
    );

    return {
      status: 'success',
      message: 'Pokemon Shuffled',
      data: {
        coinAmount,
      },
    };
  }

  async putCreditCoinHandler(request) {
    this._validator.validatePutCreditCoinSchemaPayload(request.payload);
    const { creditId } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    const coinAmount = await this._service.increaseCreditCoin(
      creditId,
      ownerId
    );

    return {
      status: 'success',
      message: 'Coin Increased',
      data: {
        coinAmount,
      },
    };
  }
}

module.exports = CreditsHandler;
