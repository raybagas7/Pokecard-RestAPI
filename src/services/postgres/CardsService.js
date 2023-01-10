const { Pool } = require('pg');
const format = require('pg-format');
const AuthorizationError = require('../../exceptions/AuthorizationError');
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
        `card-${card.id}`,
        card.poke_id,
        card.name,
        card.attribute,
        card.legendary,
        card.mythical,
        JSON.stringify(card.types),
        JSON.stringify(card.stats),
        JSON.stringify(card.move1),
        JSON.stringify(card.move2),
        owner,
      ])
    );

    const result = await this._pool.query(
      format(
        'INSERT INTO cards (card_id, poke_id, name, attribute, legendary, mythical, types, stats, move1, move2, owner) VALUES %L RETURNING card_id, poke_id, name',
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

  async verifyIdAndCardOwner(cardId, owner) {
    const query = {
      text: 'SELECT card_id, owner FROM cards WHERE card_id = $1',
      values: [cardId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Card not exist');
    }

    const card = result.rows[0];

    if (card.owner !== owner) {
      throw new AuthorizationError('This card is not belong to you');
    }
  }

  async swapCardOwner(traderId, OffererId, traderCardId, offererCardId) {
    const query = {
      text: `UPDATE cards
        SET owner = CASE card_id
        WHEN $1 THEN $2
        WHEN $3 THEN $4 END
        WHERE card_id IN($1, $3)`,
      values: [traderCardId, OffererId, offererCardId, traderId],
    };

    await this._pool.query(query);
  }

  async getTotalCardsBySearchId(searchId) {
    const query = {
      text: `SELECT users.trainer_name, users.search_id, users.profile_img,
      COUNT(CASE WHEN (legendary = false AND mythical = false) AND attribute = 'normal' THEN 1 ELSE null END) AS Normal,
      COUNT(CASE WHEN (legendary = false AND mythical = false) AND attribute = 'shiny' THEN 1 ELSE null END) AS Shiny,
      COUNT(CASE WHEN (legendary = true OR mythical = true) AND attribute = 'normal' THEN 1 ELSE null END) AS legendarymyth,
      COUNT(CASE WHEN (legendary = true OR mythical = true) AND attribute = 'shiny' THEN 1 ELSE null END) AS lmshine
      FROM users
      LEFT JOIN cards
      ON users.id = cards.owner
      WHERE users.search_id = $1
      GROUP BY users.id, users.trainer_name`,
      values: [searchId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Trainer not exist');
    }

    return result.rows[0];
  }
}

module.exports = CardsService;
