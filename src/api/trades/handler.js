const autoBind = require('auto-bind');

class TradesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async updateWindowHandler(request) {
    this._validator.validatePutWindowPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { card_id, window_number } = request.payload;

    await this._service.updateCardToWindow(
      card_id,
      credentialId,
      window_number
    );

    return {
      status: 'success',
      message: `Card added to window trades number ${window_number}`,
    };
  }

  async getUserTradesHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const trades = await this._service.getUserTrades(credentialId);
    return {
      status: 'success',
      message: `Trades retrieved`,
      data: { trades },
    };
  }
}

module.exports = TradesHandler;
