const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadPPHandler(request, h) {
    const { profileImg } = request.payload;
    // console.log(profileImg);
    // const { id } = request.params;
    const { id: ownerId } = request.auth.credentials;
    this._validator.validateImageHeaders(profileImg.hapi.headers);

    const filename = await this._service.writeFile(
      profileImg,
      profileImg.hapi,
      ownerId
    );
    await this._service.addPPtoUser(ownerId, filename);

    const response = h.response({
      status: 'success',
      message: 'Profile picture has changed',
      data: { filename },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
