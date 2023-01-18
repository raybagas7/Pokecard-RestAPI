const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CreditsService {
  constructor(usersService) {
    this._pool = new Pool();
    this._usersService = usersService;
  }

  async addNewCredit(owner) {
    const id = `credit-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO credits VALUES($1, 10, 3, 2, 3000, $2) RETURNING credit_id',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to add a new credit');
    }

    return result.rows[0].credit_id;
  }

  async verifyCreditIdAndOwner(creditId, owner) {
    const query = {
      text: 'SELECT * FROM credits WHERE credit_id = $1',
      values: [creditId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Credit not exist');
    }

    const credit = result.rows[0];

    if (credit.owner !== owner) {
      throw new AuthorizationError("You can't access this credit");
    }
  }

  async reducePokeBall(
    pokeball_amount = 0,
    ultraball_amount = 0,
    masterball_amount = 0,
    creditId,
    ownerId
  ) {
    await this.verifyCreditIdAndOwner(creditId, ownerId);
    await this.verifyBallAvailability(
      pokeball_amount,
      ultraball_amount,
      masterball_amount,
      creditId
    );

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

    return result.rows[0];
  }

  async verifyBallAvailability(
    pokeball_amount = 0,
    ultraball_amount = 0,
    masterball_amount = 0,
    creditId
  ) {
    const query = {
      text: `SELECT poke_ball, ultra_ball, master_ball
      FROM credits
      WHERE credit_id = $1`,
      values: [creditId],
    };

    const result = await this._pool.query(query);

    const credit = result.rows[0];

    if (
      pokeball_amount > credit.poke_ball ||
      ultraball_amount > credit.ultra_ball ||
      masterball_amount > credit.master_ball
    ) {
      throw new InvariantError(
        'Failed to pick pokemon because the amount of the the ball you have is less than the request ball'
      );
    }
  }

  async checkMinimumCoinAvailability(creditId, owner) {
    const query = {
      text: 'SELECT coin FROM credits WHERE credit_id = $1 AND owner = $2',
      values: [creditId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rows[0].coin < 100) {
      throw new InvariantError('Your coin is low');
    }
  }

  async shufflePokemonWithCoin(creditId, owner) {
    await this.verifyCreditIdAndOwner(creditId, owner);
    await this.checkMinimumCoinAvailability(creditId, owner);

    const query = {
      text: `UPDATE credits
      SET coin = coin - 100
      WHERE credit_id = $1
      AND owner = $2
      RETURNING credit_id, coin`,
      values: [creditId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to shuffle pokemon with coin');
    }

    return result.rows[0];
  }

  // async increaseCreditCoin(creditId, owner) {
  //   await this.verifyCreditIdAndOwner(creditId, owner);

  //   const query = {
  //     text: `UPDATE credits
  //     SET coin = coin + 500
  //     WHERE credit_id = $1
  //     AND owner = $2
  //     RETURNING credit_id, coin`,
  //     values: [creditId, owner],
  //   };

  //   const result = await this._pool.query(query);

  //   if (!result.rowCount) {
  //     throw new InvariantError('Failed to add coin');
  //   }

  //   return result.rows[0];
  // }

  async getCreditByOwnerId(ownerId) {
    const query = {
      text: 'SELECT * FROM credits WHERE owner = $1',
      values: [ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Credit never exist');
    }

    return result.rows[0];
  }

  async getUserCreditAndTotalCards(ownerId) {
    const query = {
      text: `SELECT poke_ball, ultra_ball, master_ball, coin,
      COUNT(CASE WHEN (legendary = false AND mythical = false) AND attribute = 'normal' THEN 1 ELSE null END) AS Normal,
      COUNT(CASE WHEN (legendary = false AND mythical = false) AND attribute = 'shiny' THEN 1 ELSE null END) AS Shiny,
      COUNT(CASE WHEN (legendary = true OR mythical = true) AND attribute = 'normal' THEN 1 ELSE null END) AS legendarymyth,
      COUNT(CASE WHEN (legendary = true OR mythical = true) AND attribute = 'shiny' THEN 1 ELSE null END) AS lmshine
      FROM credits
      LEFT JOIN cards
      ON credits.owner = cards.owner
      WHERE credits.owner = $1
      GROUP BY credits.poke_ball, credits.ultra_ball, credits.master_ball, credits.coin`,
      values: [ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('User never exist');
    }

    return result.rows[0];
  }

  async claimDailyCredit(ownerId) {
    await this._usersService.checkVerifiedUser(ownerId);
    await this._usersService.verifyAbleToClaim(ownerId);
    await this._usersService.setNextDailyTommorow(ownerId);

    const query = {
      text: `UPDATE credits SET poke_ball = poke_ball + 7,
      ultra_ball = ultra_ball + 3,
      master_ball = master_ball + 1,
      coin = coin + 1000
      WHERE owner = $1
      RETURNING poke_ball, ultra_ball, master_ball, coin`,
      values: [ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Failed to claim daily gift');
    }

    return result.rows[0];
  }
}

module.exports = CreditsService;
