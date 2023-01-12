const autoBind = require('auto-bind');

class TradesHandler {
  constructor(tradesService, showcasesService, offersService, validator) {
    this._tradesService = tradesService;
    this._showcasesService = showcasesService;
    this._offersService = offersService;
    this._validator = validator;
    autoBind(this);
  }

  async updateWindowHandler(request) {
    this._validator.validatePutWindowPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { card_id, window_number } = request.payload;

    await this._showcasesService.checkUserShowcasesAvailability(
      card_id,
      credentialId
    );

    await this._offersService.verifyOffererCardIdAvailability(card_id);

    await this._tradesService.updateCardToWindow(
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

    const trades = await this._tradesService.getUserTrades(credentialId);
    return {
      status: 'success',
      message: `Trades retrieved`,
      data: { trades },
    };
  }
}

module.exports = TradesHandler;
