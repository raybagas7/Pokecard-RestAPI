/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: false,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
