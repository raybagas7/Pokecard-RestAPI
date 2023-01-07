const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ShowcasesService {
  constructor(cardsService) {
    this._pool = new Pool();
    this._cardsService = cardsService;
  }

  async addShowCases(userId) {
    const showCaseId = `showcase-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO showcases (showcase_id, owner) VALUES($1, $2)',
      values: [showCaseId, userId],
    };
    await this._pool.query(query);
  }

  async updateCardToCase(cardId, userId, caseNumber) {
    await this._cardsService.verifyIdAndCardOwner(cardId, userId);

    const query = {
      text: `UPDATE showcases SET case${caseNumber} = $1
      WHERE owner = $2`,
      values: [cardId, userId],
    };

    await this._pool.query(query);
  }

  async getUserShowcases(userId) {
    const query = {
      text: `WITH newmain
      AS (SELECT
        unnest(array[1, 2, 3, 4, 5, 6]) AS "case_number",
        unnest(array[case1, case2, case3, case4, case5, case6]) AS "card_id"
        FROM showcases
        WHERE showcases.owner = $1)
      SELECT newmain.*, cards.poke_id, cards.name, cards.attribute, cards.legendary, cards.mythical, cards.types, cards.stats, cards.move1, cards.move2
      FROM newmain
      LEFT JOIN cards
      ON newmain.card_id = cards.card_id
      ORDER BY newmain.case_number`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Error to retrieve showcases');
    }

    return result.rows;
  }

  async checkUserShowcasesAvailability(traderCardId, userId) {
    const query = {
      text: `SELECT case1, case2, case3, case4, case5, case6
      FROM showcases WHERE owner = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('showcases not found');
    }

    const check = result.rows[0];

    const cases = Object.values(check);

    if (cases.indexOf(traderCardId) !== -1) {
      throw new InvariantError(
        `Your card is in showcases you can't add it to trades or make an offer`
      );
    }
  }
}

module.exports = ShowcasesService;
