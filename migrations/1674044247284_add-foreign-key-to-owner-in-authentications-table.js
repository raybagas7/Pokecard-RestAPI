/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'authentications',
    'fk_authentications.owner_users.username',
    'FOREIGN KEY(owner) REFERENCES users(username) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'authentications',
    'fk_authentications.owner_users.username'
  );
};
