const autoBind = require('auto-bind');
class CardsHandler {
  constructor(creditsService, cardsService, validator) {
    this._cardsService = cardsService;
    this._creditsService = creditsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCardByOwnerHandler(request, h) {
    this._validator.validateAddCardByOwnerPayload(request.payload);
    const {
      pokeball_amount,
      ultraball_amount,
      masterball_amount,
      creditId,
      cardsData,
    } = request.payload;

    const { id: ownerId } = request.auth.credentials;

    const balls = await this._creditsService.reducePokeBall(
      pokeball_amount,
      ultraball_amount,
      masterball_amount,
      creditId,
      ownerId
    );
    const cardsId = await this._cardsService.addCardByOwner(cardsData, ownerId);

    const response = h.response({
      status: 'success',
      message: 'Card Added',
      data: {
        balls,
        cardsId,
      },
    });

    response.code(201);
    return response;
  }

  async getCardByOwnerHandler(request) {
    const { id: ownerId } = request.auth.credentials;

    const cards = await this._cardsService.getCardByOwner(ownerId);

    return {
      status: 'success',
      message: 'Card retrieved',
      data: {
        cards,
      },
    };
  }

  async getCardByElementTypeHandler(request) {
    const { elementType } = request.params;
    const { id: ownerId } = request.auth.credentials;

    const cards = await this._cardsService.getCardByElement(
      elementType,
      ownerId
    );

    return {
      status: 'success',
      message: `Card with element ${elementType} type`,
      data: {
        cards,
      },
    };
  }
}

module.exports = CardsHandler;
