/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('cards', {
    card_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    poke_id: {
      type: 'INT',
      notNull: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    attribute: {
      type: 'TEXT',
      notNull: true,
    },
    legendary: {
      type: 'BOOLEAN',
      notNull: true,
    },
    types: {
      type: 'JSON',
      notNull: true,
    },
    stats: {
      type: 'JSON',
      notNull: true,
    },
    move1: {
      type: 'JSON',
      notNull: true,
    },
    move2: {
      type: 'JSON',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('cards');
};
