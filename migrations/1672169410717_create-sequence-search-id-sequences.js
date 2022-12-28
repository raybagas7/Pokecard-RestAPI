exports.up = (pgm) => {
  pgm.createSequence('search_id_sequences', {
    type: 'INT',
    start: 2300,
    increment: 1,
  });
};

exports.down = (pgm) => {
  pgm.dropSequence('search_id_sequences');
};
