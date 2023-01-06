/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'trades',
    'fk_trades.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'trades',
    'fk_trades.window1_cards.card_id',
    'FOREIGN KEY(window1) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'trades',
    'fk_trades.window2_cards.card_id',
    'FOREIGN KEY(window2) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'trades',
    'fk_trades.window3_cards.card_id',
    'FOREIGN KEY(window3) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'trades',
    'fk_trades.window4_cards.card_id',
    'FOREIGN KEY(window4) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'trades',
    'fk_trades.window5_cards.card_id',
    'FOREIGN KEY(window5) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'trades',
    'fk_trades.window6_cards.card_id',
    'FOREIGN KEY(window6) REFERENCES cards(card_id) ON DELETE SET NULL'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('trades', 'fk_trades.owner_users.id');
  pgm.dropConstraint('trades', 'fk_trades.window1_cards.card_id');
  pgm.dropConstraint('trades', 'fk_trades.window2_cards.card_id');
  pgm.dropConstraint('trades', 'fk_trades.window3_cards.card_id');
  pgm.dropConstraint('trades', 'fk_trades.window4_cards.card_id');
  pgm.dropConstraint('trades', 'fk_trades.window5_cards.card_id');
  pgm.dropConstraint('trades', 'fk_trades.window6_cards.card_id');
};
