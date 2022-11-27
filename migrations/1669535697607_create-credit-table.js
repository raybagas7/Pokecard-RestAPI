/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('credit', {
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
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('credit');
};
