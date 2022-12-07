/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addConstraint(
    'credits',
    'poke_ball_nonnegative',
    'CHECK (poke_ball >= 0)'
  );

  pgm.addConstraint(
    'credits',
    'ultra_ball_nonnegative',
    'CHECK (ultra_ball >= 0)'
  );

  pgm.addConstraint(
    'credits',
    'master_ball_nonnegative',
    'CHECK (master_ball >= 0)'
  );

  pgm.addConstraint('credits', 'coin_nonnegative', 'CHECK (coin >= 0)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('credits', 'poke_ball_nonnegative');
  pgm.dropConstraint('credits', 'ultra_ball_nonnegative');
  pgm.dropConstraint('credits', 'master_ball_nonnegative');
  pgm.dropConstraint('credits', 'coin_nonnegative');
};
