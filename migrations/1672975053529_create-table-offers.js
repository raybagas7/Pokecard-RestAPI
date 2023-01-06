/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('offers', {
    offer_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    offerer_card_id: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    trader_card_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('offers');
};
