/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'showcases',
    'fk_showcases.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'showcases',
    'fk_showcases.case1_cards.card_id',
    'FOREIGN KEY(case1) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'showcases',
    'fk_showcases.case2_cards.card_id',
    'FOREIGN KEY(case2) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'showcases',
    'fk_showcases.case3_cards.card_id',
    'FOREIGN KEY(case3) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'showcases',
    'fk_showcases.case4_cards.card_id',
    'FOREIGN KEY(case4) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'showcases',
    'fk_showcases.case5_cards.card_id',
    'FOREIGN KEY(case5) REFERENCES cards(card_id) ON DELETE SET NULL'
  );

  pgm.addConstraint(
    'showcases',
    'fk_showcases.case6_cards.card_id',
    'FOREIGN KEY(case6) REFERENCES cards(card_id) ON DELETE SET NULL'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('showcases', 'fk_showcases.owner_users.id');
  pgm.dropConstraint('showcases', 'fk_showcases.case1_cards.card_id');
  pgm.dropConstraint('showcases', 'fk_showcases.case2_cards.card_id');
  pgm.dropConstraint('showcases', 'fk_showcases.case3_cards.card_id');
  pgm.dropConstraint('showcases', 'fk_showcases.case4_cards.card_id');
  pgm.dropConstraint('showcases', 'fk_showcases.case5_cards.card_id');
  pgm.dropConstraint('showcases', 'fk_showcases.case6_cards.card_id');
};
