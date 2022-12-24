/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('shuffled', {
    shuffle_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    cards: {
      type: 'JSON',
    },
    owner: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('shuffled');
};
