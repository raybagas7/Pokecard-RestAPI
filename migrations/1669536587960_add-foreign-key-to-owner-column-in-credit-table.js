/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'credits',
    'fk_credit.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('credits', 'fk_credit.owner_users.id');
};
