const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class OffersService {
  constructor(cardsService, showcasesService, tradesService) {
    this._pool = new Pool();
    this._cardsService = cardsService;
    this._showcasesService = showcasesService;
    this._tradesService = tradesService;
  }

  async addAnOffer(offerer_cardId, trader_cardId, offererUserId) {
    await this.verifyOffererCardIdAvailability(offerer_cardId);
    await this.checkMaximumOffer(trader_cardId);
    await this._showcasesService.checkUserShowcasesAvailability(
      offerer_cardId,
      offererUserId
    );
    await this._tradesService.getUserTradesAvailability(
      offerer_cardId,
      offererUserId
    );

    await this._cardsService.verifyIdAndCardOwner(
      offerer_cardId,
      offererUserId
    );

    const offerId = `offer-${nanoid(16)}`;

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
      throw new InvariantError(`This card is currently on offer`);
    }
  }

  async checkMaximumOffer(trader_cardId) {
    const query = {
      text: 'SELECT offer_id FROM offers WHERE trader_card_id = $1',
      values: [trader_cardId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length >= 6) {
      throw new InvariantError(
        `You can't make an offer into this card due to maximum offers to this trade card`
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

  async getOfferListForTraderByCardId(traderCardId, traderId) {
    await this._cardsService.verifyIdAndCardOwner(traderCardId, traderId);

    const query = {
      text: `SELECT offers.offerer_card_id, offers.offer_id, cards.poke_id, cards.name, cards.attribute, cards.legendary,
            cards.mythical, cards.types, cards.stats, cards.move1, cards.move2, cards.owner,
            users.trainer_name, users.search_id, users.profile_img
            from offers
            JOIN cards
            ON offers.offerer_card_id = cards.card_id
            JOIN users
            ON cards.owner = users.id
            WHERE offers.trader_card_id = $1`,
      values: [traderCardId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('No offer found for this card');
    }

    return result.rows;
  }

  async acceptAnOffer(traderId, offererId, traderCardId, offererCardId) {
    await this._cardsService.verifyIdAndCardOwner(traderCardId, traderId);
    await this._cardsService.swapCardOwner(
      traderId,
      offererId,
      traderCardId,
      offererCardId
    );
    await this._tradesService.updateCardIdFromTrades(traderId, traderCardId);

    const query = {
      text: 'DELETE FROM offers WHERE trader_card_id = $1',
      values: [traderCardId],
    };

    await this._pool.query(query);
  }

  async getOfferDetail(offer_id) {
    const query = {
      text: 'SELECT * FROM offers WHERE offer_id = $1',
      values: [offer_id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Offer not exist');
    }

    return result.rows[0];
  }

  //   async swapCardOwner(traderId, OffererId, traderCardId, offererCardId) {
  //     const query = {
  //       text: `UPDATE cards
  //         SET owner = CASE card_id
  //         WHEN $1 THEN $2
  //         WHEN $3 THEN $4 END
  //         WHERE card_id IN($1, $3)`,
  //       values: [traderCardId, OffererId, offererCardId, traderId],
  //     };

  //     await this._pool.query(query);
  //   }
}

module.exports = OffersService;
