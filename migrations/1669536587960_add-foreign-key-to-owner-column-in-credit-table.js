/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'credit',
    'fk_credit.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('credit', 'fk_credit.owner_users.id');
};
