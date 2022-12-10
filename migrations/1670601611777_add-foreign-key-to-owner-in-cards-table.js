/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'cards',
    'fk_cards.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('cards', 'fk_cards.owner_users.id');
};
