/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('showcases', {
    showcase_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    case1: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    case2: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    case3: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    case4: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    case5: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    case6: {
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
  pgm.dropTable('showcases');
};
