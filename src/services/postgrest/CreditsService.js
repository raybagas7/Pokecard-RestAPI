const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CreditsService {
  constructor() {
    this._pool = new Pool();
  }

  async addNewCredit(owner) {
    const id = `credit-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO credits VALUES($1, 30, 15, 5, 5000, $2) RETURNING credit_id',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add a new credit');
    }

    return result.rows[0].credit_id;
  }

  async verifyCreditId(creditId) {
    const query = {
      text: 'SELECT * FROM credits WHERE credit_id = $1',
      values: [creditId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Credit not exist');
    }
  }

  async reducePokeBall(
    pokeball_amount = 0,
    ultraball_amount = 0,
    masterball_amount = 0,
    creditId,
    ownerId
  ) {
    await this.verifyCreditId(creditId);

    const query = {
      text: `UPDATE credits 
      SET poke_ball = poke_ball - $1,
      ultra_ball = ultra_ball - $2,
      master_ball = master_ball -$3
      WHERE credit_id = $4
      AND owner = $5
      RETURNING credit_id, poke_ball, ultra_ball, master_ball`,
      values: [
        pokeball_amount,
        ultraball_amount,
        masterball_amount,
        creditId,
        ownerId,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to update poke_ball');
    }

    return result.rows;
  }
}

module.exports = CreditsService;
