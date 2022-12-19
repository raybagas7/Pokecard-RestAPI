/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('verifications', {
    owner: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('verifications');
};
