const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class UsersService {
  constructor(showcasesService, shuffledService, tradesService, cardsService) {
    this._pool = new Pool();
    this._showcasesService = showcasesService;
    this._shuffledService = shuffledService;
    this._tradesService = tradesService;
    this._cardsService = cardsService;
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

  async verifyUserCredentialByToken(userId, password) {
    const query = {
      text: 'SELECT password FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthenticationError(
        'The credentials you provide are in correct'
      );
    }

    const { password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Wrong Password');
    }
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

  async paswordChange(ownerId, currentPassword, newPassword) {
    await this.verifyUserCredentialByToken(ownerId, currentPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = {
      text: 'UPDATE users SET password = $1 WHERE id = $2',
      values: [hashedPassword, ownerId],
    };

    await this._pool.query(query);
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

  async checkVerifiedUser(userId) {
    const query = {
      text: 'SELECT is_valid FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    const isValid = result.rows[0];

    if (isValid.is_valid === false) {
      throw new AuthorizationError(
        'You need to verify your email to claim daily gift'
      );
    }
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

  async getUserInformationBySearchId(searchId) {
    const query = {
      text: 'SELECT search_id FROM users WHERE search_id = $1',
      values: [searchId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No trainer with this friend or search id');
    }

    const totalCards = await this._cardsService.getTotalCardsBySearchId(
      searchId
    );

    const showcaseCards =
      await this._showcasesService.getUserShowcasesBySearchId(searchId);

    const tradeCards = await this._tradesService.getUserTradesBySearchId(
      searchId
    );

    return { totalCards, showcaseCards, tradeCards };
  }

  async getRandomUser(userId) {
    const query = {
      text: `SELECT users.trainer_name, users.search_id, users.profile_img,
      COUNT(CASE WHEN (legendary = false AND mythical = false) AND attribute = 'normal' THEN 1 ELSE null END) AS Normal,
      COUNT(CASE WHEN (legendary = false AND mythical = false) AND attribute = 'shiny' THEN 1 ELSE null END) AS Shiny,
      COUNT(CASE WHEN (legendary = true OR mythical = true) AND attribute = 'normal' THEN 1 ELSE null END) AS legendarymyth,
      COUNT(CASE WHEN (legendary = true OR mythical = true) AND attribute = 'shiny' THEN 1 ELSE null END) AS lmshine
      FROM users
      LEFT JOIN cards
      ON users.id = cards.owner
      WHERE users.id != $1
      GROUP BY users.id, users.trainer_name
      ORDER BY RANDOM()
      LIMIT 30;`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No other trainer registered yet');
    }

    return result.rows;
  }

  async verifyOnlyEmailAvailability(email) {
    const query = {
      text: 'SELECT email, is_valid FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Email not found');
    }

    const isValid = result.rows[0];

    if (isValid.is_valid === false) {
      throw new AuthorizationError(
        'You need to verify your email to request forgot password'
      );
    }
  }

  async forgotPassword(email) {
    await this.verifyOnlyEmailAvailability(email);
    const newPassword = nanoid(8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = {
      text: 'UPDATE users SET password = $1 WHERE email = $2',
      values: [hashedPassword, email],
    };

    await this._pool.query(query);

    return newPassword;
  }
}

module.exports = UsersService;
