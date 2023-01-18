/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTrigger('users', 'insert_new_user_auth', {
    when: 'AFTER',
    operation: 'INSERT',
    function: 'add_new_token_owner',
    level: 'ROW',
  });
};

exports.down = (pgm) => {
  pgm.dropTrigger('users', 'insert_new_user_auth');
};
