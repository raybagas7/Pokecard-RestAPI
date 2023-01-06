/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('trades', {
    trade_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    window1: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    window2: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    window3: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    window4: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    window5: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    window6: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    owner: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('trades');
};
