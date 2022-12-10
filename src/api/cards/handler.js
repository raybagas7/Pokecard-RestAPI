const autoBind = require('auto-bind');
class CardsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postCardByOwnerHandler(request, h) {
    this._validator.validateAddCardByOwnerPayload(request.payload);
    const { cardsData } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    const cardsId = await this._service.addCardByOwner(cardsData, ownerId);

    const response = h.response({
      status: 'success',
      message: 'Card Added',
      data: {
        cardsId,
      },
    });

    response.code(201);
    return response;
  }

  async getCardByOwnerHandler(request) {
    const { id: ownerId } = request.auth.credentials;

    const cards = await this._service.getCardByOwner(ownerId);

    return {
      status: 'success',
      message: 'Card retrieved',
      data: {
        cards,
      },
    };
  }
}

module.exports = CardsHandler;
