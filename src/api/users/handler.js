const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, trainer_name, email } = request.payload;

    const userId = await this._service.addUser({
      username,
      password,
      trainer_name,
      email,
    });
    const response = h.response({
      status: 'success',
      message: 'New user has been made',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getRandomUser(request) {
    const { id: ownerId } = request.auth.credentials;
    const pool = await this._service.getRandomUser(ownerId);

    return {
      status: 'success',
      data: { pool },
    };
  }

  async getUserByIdHandler(request) {
    const { id: ownerId } = request.auth.credentials;
    const user = await this._service.getUserById(ownerId);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async getUserInformationBySearchId(request) {
    const { search_id } = request.params;
    const data = await this._service.getUserInformationBySearchId(search_id);

    return {
      status: 'success',
      message: 'User informations retrieved',
      data,
    };
  }

  async changeUserPasswordHandler(request) {
    this._validator.validateUserNewPasswordPayload(request.payload);
    const { currentPassword, newPassword } = request.payload;
    const { id: ownerId } = request.auth.credentials;

    await this._service.paswordChange(ownerId, currentPassword, newPassword);

    return { status: 'success', message: 'User password has changed' };
  }
}

module.exports = UsersHandler;
