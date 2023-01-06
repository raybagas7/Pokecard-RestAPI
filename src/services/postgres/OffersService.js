const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class OffersService {
  constructor(cardsService) {
    this._pool = new Pool();
    this._cardsService = cardsService;
  }

  async addAnOffer(offerer_cardId, trader_cardId, offererUserId) {
    await this.verifyOffererCardIdAvailability(offerer_cardId);
    const offerId = `offer-${nanoid(16)}`;
    await this._cardsService.verifyIdAndCardOwner(
      offerer_cardId,
      offererUserId
    );

    if (offerer_cardId === trader_cardId) {
      throw new InvariantError(`You can't make an offer to your own cards`);
    }

    const query = {
      text: 'INSERT INTO offers VALUES($1, $2, $3, $4) RETURNING offer_id',
      values: [offerId, offerer_cardId, trader_cardId, offererUserId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(`Failed to add an offer`);
    }

    return result.rows[0];
  }
  // /You can't make an offer because card already offered to another trade
  async verifyOffererCardIdAvailability(offerer_cardId) {
    const query = {
      text: 'SELECT offerer_card_id FROM offers WHERE offerer_card_id = $1',
      values: [offerer_cardId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError(
        `You can't make an offer because card already offered to another trade`
      );
    }
  }

  async deleteAnOffer(offerId, userId) {
    await this.verifyOfferOwner(offerId, userId);

    const query = {
      text: 'DELETE FROM offers WHERE offer_id = $1',
      values: [offerId],
    };

    await this._pool.query(query);
  }

  async verifyOfferOwner(offerId, owner) {
    const query = {
      text: 'SELECT owner FROM offers WHERE offer_id = $1',
      values: [offerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Offer not exist');
    }

    const offer = result.rows[0];

    if (offer.owner !== owner) {
      throw new AuthorizationError('This offer is not yours');
    }
  }
}

module.exports = OffersService;
