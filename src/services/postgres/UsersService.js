const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor(showcasesService, shuffledService, tradesService) {
    this._pool = new Pool();
    this._showcasesService = showcasesService;
    this._shuffledService = shuffledService;
    this._tradesService = tradesService;
  }

  async verifyNewUsername(username, email) {
    const query = {
      text: 'SELECT username, email from users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      const selectedEmail = result.rows[0].email;

      if (selectedEmail === email) {
        throw new InvariantError(`This email '${email}' has been used`);
      }
    }

    if (result.rowCount > 0) {
      throw new InvariantError(
        `Failed to add new user as '${username}' because Username has been used`
      );
    }
  }

  async addUser({
    username,
    password,
    trainer_name,
    profile_img = undefined,
    email,
  }) {
    await this.verifyNewUsername(username, email);

    const id = `poke-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const indoTimesNow = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

    const query = {
      text: `INSERT INTO users (id, search_id, username, password, trainer_name, profile_img, email, next_daily) 
      VALUES($1, nextval('search_id_sequences'), $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [
        id,
        username,
        hashedPassword,
        trainer_name,
        profile_img,
        email,
        indoTimesNow,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add a new user');
    }
    await this._showcasesService.addShowCases(id);
    await this._tradesService.addTrades(id);
    await this._shuffledService.addNewShufflePool(id);

    return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, search_id, username, trainer_name, email, profile_img, is_valid, wait_verify, next_daily FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("User can't be found");
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError(
        'The credentials you provide are in correct'
      );
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Wrong Password');
    }

    return id;
  }

  async setUserToLoggedIn(userId) {
    const indoTimestamps = moment()
      .tz('Asia/Jakarta')
      .format('YYYY-MM-DD hh:mm:ss');
    const query = {
      text: 'UPDATE users SET is_login = true, last_login = $1 WHERE id = $2',
      values: [indoTimestamps, userId],
    };

    await this._pool.query(query);
  }

  async setUserToLoggedOut(userId) {
    const query = {
      text: 'UPDATE users SET is_login = false WHERE id = $1',
      values: [userId],
    };

    await this._pool.query(query);
  }

  async verifyEmailAvailability(userId, userEmail) {
    const query = {
      text: 'SELECT trainer_name, email FROM users WHERE id = $1 AND email = $2',
      values: [userId, userEmail],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Email not found');
    }

    await this.setToWaitingForVerify(userId);

    return result.rows[0].trainer_name;
  }

  async setToWaitingForVerify(id) {
    const query = {
      text: 'UPDATE users SET wait_verify = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async setToNotWaitingForVerify(id) {
    const query = {
      text: 'UPDATE users SET wait_verify = false WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async validatingUser(userId) {
    const query = {
      text: 'UPDATE users SET is_valid = true, wait_verify = false WHERE id = $1',
      values: [userId],
    };

    await this._pool.query(query);
  }

  async verifyAbleToClaim(userId) {
    const query = {
      text: 'SELECT next_daily FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    const daily = result.rows[0];

    if (!result.rowCount) {
      throw new InvariantError('User never exist');
    }

    const indoTimesNow = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

    const beAble = moment(daily.next_daily).isSameOrBefore(indoTimesNow);

    if (!beAble) {
      throw new InvariantError(`You can't get daily claim now`);
    }
  }

  async setNextDailyTommorow(userId) {
    const indoTimesNow = moment()
      .tz('Asia/Jakarta')
      .add(1, 'd')
      .format('YYYY-MM-DD');

    const query = {
      text: 'UPDATE users SET next_daily = $1 WHERE id = $2',
      values: [indoTimesNow, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = UsersService;
