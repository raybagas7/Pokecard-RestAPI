const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class TradesService {
  constructor(cardsService) {
    this._pool = new Pool();
    this._cardsService = cardsService;
  }

  async addTrades(userId) {
    const tradeId = `trade-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO trades (trade_id, owner) VALUES($1, $2)',
      values: [tradeId, userId],
    };

    await this._pool.query(query);
  }

  async updateCardToWindow(cardId, userId, windowNumber) {
    await this._cardsService.verifyIdAndCardOwner(cardId, userId);
    await this.verifyCardIdInTrades(cardId, userId);

    const query = {
      text: `UPDATE trades SET window${windowNumber} = $1
      WHERE owner = $2`,
      values: [cardId, userId],
    };

    await this._pool.query(query);
  }

  async verifyCardIdInTrades(cardId, userId) {
    const query = {
      text: `SELECT window1, window2, window3, window4, window5, window6
      FROM trades WHERE owner = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('trades not found');
    }

    const check = result.rows[0];

    const windows = Object.values(check);

    if (windows.indexOf(cardId) !== -1) {
      throw new InvariantError(`Your card is already in trades`);
    }
  }

  async getUserTrades(userId) {
    const query = {
      text: `WITH newmain
      AS (SELECT
      unnest(array[1, 2, 3, 4, 5, 6]) AS "window_number",
      unnest(array[window1, window2, window3, window4, window5, window6]) AS "card_id"
      FROM trades
      WHERE trades.owner = $1)
      SELECT newmain.*, cards.poke_id, cards.name, cards.attribute, cards.legendary, cards.mythical, cards.types, cards.stats, cards.move1, cards.move2
      FROM newmain
      LEFT JOIN cards
      ON newmain.card_id = cards.card_id
      ORDER BY newmain.window_number`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Error to retrieve trades');
    }

    return result.rows;
  }

  async getUserTradesBySearchId(searchId) {
    const query = {
      text: `WITH newmain
      AS (SELECT
        unnest(array[1, 2, 3, 4, 5, 6]) AS "window_number",
        unnest(array[trades.window1, trades.window2, trades.window3, trades.window4, trades.window5, trades.window6]) AS "card_id"
        FROM users
        LEFT JOIN trades
        ON users.id = trades.owner
        WHERE users.search_id = $1
      GROUP BY users.id, users.trainer_name, trades.window1, trades.window2, trades.window3, trades.window4, trades.window5, trades.window6)
      SELECT newmain.*, cards.poke_id, cards.name, cards.attribute, cards.legendary, cards.mythical, cards.types, cards.stats, cards.move1, cards.move2
      FROM newmain
      LEFT JOIN cards
      ON newmain.card_id = cards.card_id
      ORDER BY newmain.window_number`,
      values: [searchId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Error to retrieve trades');
    }

    return result.rows;
  }

  async getUserTradesAvailability(showcaseCardId, userId) {
    const query = {
      text: `SELECT window1, window2, window3, window4, window5, window6
      FROM trades WHERE owner = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('trades not found');
    }

    const check = result.rows[0];

    const windows = Object.values(check);

    if (windows.indexOf(showcaseCardId) !== -1) {
      throw new InvariantError(
        `Your card is in trades you can't add it to showcases or make an offer`
      );
    }
  }

  async getWindowNumberFromCardId(ownerId, tradeCardId) {
    const query = {
      text: `WITH newmain
      AS (SELECT
      unnest(array[1, 2, 3, 4, 5, 6]) AS "window_number",
      unnest(array[window1, window2, window3, window4, window5, window6]) AS "card_id"
      FROM trades
      WHERE trades.owner = $1)
      SELECT newmain.window_number
      FROM newmain
      LEFT JOIN cards
      ON newmain.card_id = cards.card_id
      WHERE newmain.card_id = $2
      ORDER BY newmain.window_number`,
      values: [ownerId, tradeCardId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Card is not exist in trades');
    }

    const windowNumber = result.rows[0];

    return windowNumber.window_number;
  }

  async updateCardIdFromTrades(ownerId, tradeCardId) {
    const windowNumber = await this.getWindowNumberFromCardId(
      ownerId,
      tradeCardId
    );

    const query = {
      text: `UPDATE trades SET window${windowNumber} = null WHERE owner = $1`,
      values: [ownerId],
    };

    await this._pool.query(query);
  }
}

module.exports = TradesService;
