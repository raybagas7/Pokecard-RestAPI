const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token, username) {
    const query = {
      text: 'UPDATE authentications SET token = $1 WHERE owner = $2',
      values: [token, username],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token are invalid');
    }
  }

  async deleteRefreshToken(token, username) {
    const query = {
      text: 'UPDATE authentications SET token = null WHERE token = $1 AND owner = $2',
      values: [token, username],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
