const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

class ShuffledService {
  constructor() {
    this._pool = new Pool();
  }

  async addNewShufflePool(userId) {
    const shuffleId = `shuffle-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO shuffled (shuffle_id, owner) VALUES($1, $2)',
      values: [shuffleId, userId],
    };

    await this._pool.query(query);
  }

  async updateShuffledCards(cards, userId) {
    const cardsArray = JSON.stringify(cards);
    const query = {
      text: 'UPDATE shuffled SET cards = $1 WHERE owner = $2',
      values: [cardsArray, userId],
    };

    await this._pool.query(query);
  }

  async getShuffledCards(userId) {
    const query = {
      text: 'SELECT cards FROM shuffled WHERE owner = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No cards that has been shuffled');
    }

    return result.rows[0].cards;
  }
}

module.exports = ShuffledService;
