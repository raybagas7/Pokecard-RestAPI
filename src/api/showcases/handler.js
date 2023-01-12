const autoBind = require('auto-bind');

class ShowcasesHandler {
  constructor(showcasesService, tradesService, offersService, validator) {
    this._showcasesService = showcasesService;
    this._tradesService = tradesService;
    this._offersService = offersService;
    this._validator = validator;
    autoBind(this);
  }

  async updateCaseHandler(request) {
    this._validator.validatePutCasePayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { card_id, case_number } = request.payload;

    await this._tradesService.getUserTradesAvailability(card_id, credentialId);

    await this._offersService.verifyOffererCardIdAvailability(card_id);

    await this._showcasesService.updateCardToCase(
      card_id,
      credentialId,
      case_number
    );

    return {
      status: 'success',
      message: `Card added to showcase number ${case_number}`,
    };
  }

  async getUserShowcasesHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const showcases = await this._showcasesService.getUserShowcases(
      credentialId
    );
    return {
      status: 'success',
      message: `Showcase retrieved`,
      data: { showcases },
    };
  }
}

module.exports = ShowcasesHandler;
