const crypto = require('crypto');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class VerificationsService {
  constructor(usersService, creditsService) {
    this._pool = new Pool();
    this._usersService = usersService;
    this._creditsService = creditsService;
  }

  async deleteVerificationToken(userId, token) {
    await this.checkVerificationEmailAvailability(userId, token);
    await this.checkUserValidity(userId);

    const query = {
      text: 'DELETE FROM verifications WHERE owner = $1 AND token = $2',
      values: [userId, token],
    };

    await this._pool.query(query);
    await this._usersService.validatingUser(userId);
    await this._creditsService.addBonusVerifiedUserCredit(userId);
  }

  async checkUserValidity(userId) {
    const query = {
      text: 'SELECT is_valid FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('user not found');
    }

    const verif = result.rows[0];

    if (verif.is_valid === true) {
      throw new AuthorizationError('You already verified!');
    }
  }

  async checkVerificationEmailAvailability(userId, token) {
    const query = {
      text: 'SELECT * FROM verifications WHERE owner = $1 AND token = $2',
      values: [userId, token],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Verifications not found');
    }
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
