const crypto = require('crypto');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class VerificationsService {
  constructor() {
    this._pool = new Pool();
  }

  async checkEmailAvailability(userId) {
    const query = {
      text: 'SELECT email FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Email not found');
    }
  }

  async addVerifyToken(userId) {
    await this.checkEmailAvailability(userId);
    const randStringGenerator = crypto.randomBytes(64).toString('hex');
    const query = {
      text: 'INSERT INTO verifications VALUES($1, $2)',
      values: [userId, randStringGenerator],
    };

    await this._pool.query(query);
  }
}

module.exports = VerificationsService;
