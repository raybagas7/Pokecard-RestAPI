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

  async getOfferListTraderHandler(request) {
    const { trader_card_id } = request.params;
    const { id: ownerId } = request.auth.credentials;

    const list_offer = await this._service.getOfferListForTraderByCardId(
      trader_card_id,
      ownerId
    );

    return {
      status: 'success',
      message: 'Offer list retrieved',
      data: {
        list_offer,
      },
    };
  }

  async acceptAnOfferHandler(request) {
    this._validator.validateAcceptAnOfferPayload(request.payload);
    const { id: traderId } = request.auth.credentials;
    const { offer_id } = request.payload;

    const {
      offerer_card_id: offererCardId,
      trader_card_id: traderCardId,
      owner: offererId,
    } = await this._service.getOfferDetail(offer_id);

    await this._service.acceptAnOffer(
      traderId,
      offererId,
      traderCardId,
      offererCardId
    );

    return {
      status: 'success',
      message: `Offer accepted you recieve this card ${offererCardId}`,
    };
  }
}

module.exports = OffersHandler;
