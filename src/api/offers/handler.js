const autoBind = require('auto-bind');

class OffersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postOfferHandler(request, h) {
    this._validator.validateAddAnOfferPayload(request.payload);
    const { offerer_card_id, trader_card_id } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    const tradeId = await this._service.addAnOffer(
      offerer_card_id,
      trader_card_id,
      ownerId
    );

    const response = h.response({
      status: 'success',
      message: 'New offer has been made',
      data: {
        tradeId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteOfferHandler(request) {
    this._validator.validateDeleteAnOfferPayload(request.payload);
    const { offer_id } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._service.deleteAnOffer(offer_id, ownerId);

    return {
      status: 'success',
      message: 'Offer has been deleted',
    };
  }
}

module.exports = OffersHandler;
