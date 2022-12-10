const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const format = require('pg-format');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CardsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCardByOwner(cardsData, owner) {
    const cardsArray = [];
    cardsData.map((card) =>
      cardsArray.push([
        `card-${nanoid(16)}`,
        card.poke_id,
        card.name,
        card.attribute,
        card.legendary,
        JSON.stringify(card.types),
        JSON.stringify(card.stats),
        owner,
      ])
    );

    const result = await this._pool.query(
      format(
        'INSERT INTO cards (card_id, poke_id, name, attribute, legendary, types, stats, owner) VALUES %L RETURNING card_id, poke_id, name',
        cardsArray
      )
    );

    if (!result.rowCount) {
      throw new InvariantError('Failed to add card');
    }

    return result.rows;
  }

  async getCardByOwner(ownerId) {
    const query = {
      text: 'SELECT * FROM cards WHERE owner = $1',
      values: [ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No cards belong to this owner');
    }

    return result.rows;
  }

  async getCardByElement(elementType, ownerId) {
    const result = await this._pool.query(
      `SELECT * FROM cards 
      WHERE types::jsonb @> '[{"name":"${elementType}"}]'::jsonb
      AND owner = '${ownerId}'`
    );

    if (!result.rowCount) {
      throw new NotFoundError(
        "You don't have any pokemon cards with this element type"
      );
    }

    return result.rows;
  }
}

module.exports = CardsService;
