/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('showcases', {
    showcase_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    case1: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    case2: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    case3: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    case4: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    case5: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    case6: {
      type: 'VARCHAR(50)',
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
  pgm.dropTable('showcases');
};
