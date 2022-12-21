/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('users', {
    wait_verify: {
      type: 'BOOLEAN',
      default: 'false',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'wait_verify');
};
