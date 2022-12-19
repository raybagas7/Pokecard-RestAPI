/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'verifications',
    'fk_verifications.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('verifications', 'fk_verifications.owner_users.id');
};
