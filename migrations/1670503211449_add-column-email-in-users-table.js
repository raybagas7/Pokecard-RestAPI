/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('users', {
    email: {
      type: 'CITEXT',
      unique: true,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'email');
};
