const autoBind = require('auto-bind');

class ShowcasesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async updateCaseHandler(request) {
    this._validator.validatePutCasePayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { card_id, case_number } = request.payload;

    await this._service.updateCardToCase(card_id, credentialId, case_number);

    return {
      status: 'success',
      message: `Card added to showcase number ${case_number}`,
    };
  }

  async getUserShowcasesHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const showcases = await this._service.getUserShowcases(credentialId);
    return {
      status: 'success',
      message: `Showcase retrieved`,
      data: { showcases },
    };
  }
}

module.exports = ShowcasesHandler;
