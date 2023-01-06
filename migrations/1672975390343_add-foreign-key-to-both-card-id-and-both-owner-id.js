/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'offers',
    'fk_offers.offerer_card_id_cards.card_id',
    'FOREIGN KEY(offerer_card_id) REFERENCES cards(card_id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'offers',
    'fk_offers.trader_card_id_cards.card_id',
    'FOREIGN KEY(trader_card_id) REFERENCES cards(card_id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'offers',
    'fk_offers.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('offers', 'fk_offers.offerer_card_id_cards.card_id');
  pgm.dropConstraint('offers', 'fk_offers.trader_card_id_cards.card_id');
  pgm.dropConstraint('offers', 'fk_offers.owner_users.id');
};
