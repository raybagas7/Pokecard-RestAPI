const { response } = require('@hapi/hapi/lib/validation');
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, trainer_name } = request.payload;

    const userId = await this._service.addUser({
      username,
      password,
      trainer_name,
    });
    const response = h.response({
      status: 'succes',
      message: 'New user has been made',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;
