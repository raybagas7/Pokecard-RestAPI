const { Pool } = require('pg');
const { nanoid } = require('nanoid');

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

    const query = {
      text: `UPDATE trades SET window${windowNumber} = $1
      WHERE owner = $2`,
      values: [cardId, userId],
    };

    await this._pool.query(query);
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
}

module.exports = TradesService;
