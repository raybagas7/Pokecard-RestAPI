const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, usersService, validator) {
    this._producerService = producerService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportVerifyEmailHandler(request, h) {
    this._validator.validateExportUserEmailPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { targetEmail } = request.payload;

    await this._usersService.verifyEmailAvailability(credentialId, targetEmail);

    const message = {
      userId: credentialId,
      targetEmail,
    };

    await this._producerService.sendMessage(
      'export:emailverifications',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
