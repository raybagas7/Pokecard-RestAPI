const autoBind = require('auto-bind');

class ShuffledHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async updateShuffledCardsHandler(request) {
    this._validator.validateShufflePayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { cardsData } = request.payload;

    await this._service.updateShuffledCards(cardsData, credentialId);

    return {
      status: 'success',
      message: 'Shuffle card pool has been updated',
    };
  }

  async getShuffledCardsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const cards = await this._service.getShuffledCards(credentialId);

    return {
      status: 'success',
      message: 'Shuffled cards retrieved',
      data: {
        cards,
      },
    };
  }
}

module.exports = ShuffledHandler;
