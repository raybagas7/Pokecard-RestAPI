/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('credits', {
    credit_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    poke_ball: {
      type: 'INT',
      notNull: true,
    },
    ultra_ball: {
      type: 'INT',
      notNull: true,
    },
    master_ball: {
      type: 'INT',
      notNull: true,
    },
    coin: {
      type: 'INT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('credits');
};
