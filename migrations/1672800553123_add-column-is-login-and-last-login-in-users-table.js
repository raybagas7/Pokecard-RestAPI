/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('users', {
    is_login: {
      type: 'BOOLEAN',
      default: 'false',
      notNull: true,
    },
    last_login: {
      type: 'TIMESTAMP',
    },
    next_daily: {
      type: 'DATE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'is_login');
};
