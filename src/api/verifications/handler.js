const autoBind = require('auto-bind');
class VerificationsHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async getVerifyEmail(request, h) {
    const { userId, token } = request.params;

    await this._service.deleteVerificationToken(userId, token);

    return 'verified';
  }
}

module.exports = VerificationsHandler;
