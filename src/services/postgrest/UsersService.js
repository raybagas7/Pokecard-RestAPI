const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username from users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError(
        'Failed to add new user because Username has been used'
      );
    }
  }

  async addUser({ username, password, trainer_name, profile_img = undefined }) {
    await this.verifyNewUsername(username);

    const id = `poke-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, username, hashedPassword, trainer_name, profile_img],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add a new user');
    }

    return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, trainer_name FROM users WHERE id = $1',
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
}

module.exports = UsersService;
