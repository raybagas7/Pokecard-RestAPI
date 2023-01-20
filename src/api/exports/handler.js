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

    const trainer_name = await this._usersService.verifyEmailAvailability(
      credentialId,
      targetEmail
    );
    await this._usersService.setToWaitingForVerify(credentialId);

    const message = {
      userId: credentialId,
      targetEmail,
      trainer_name,
    };

    await this._producerService.sendMessage(
      'export:emailverifications',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Your request has been queued and will be process',
    });

    response.code(201);
    return response;
  }

  async postExportForgotPasswordHandler(request, h) {
    this._validator.validateExportUserEmailPayload(request.payload);

    const { targetEmail } = request.payload;

    await this._usersService.verifyOnlyEmailAvailability(targetEmail);

    const message = {
      targetEmail,
    };

    await this._producerService.sendMessage(
      'export:forgotpassword',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Your request has been queued and will be process',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
