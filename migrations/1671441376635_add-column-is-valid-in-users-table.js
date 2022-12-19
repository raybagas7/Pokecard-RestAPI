/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('users', {
    is_valid: {
      type: 'BOOLEAN',
      default: 'false',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'is_valid');
};
