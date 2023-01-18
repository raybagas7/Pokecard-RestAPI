/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createFunction(
    'add_new_token_owner',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
      replace: true,
    },
    `
    BEGIN
    INSERT INTO authentications (owner)
	VALUES (NEW.username);
	RETURN NEW;
    END 
    `
  );
};

exports.down = (pgm) => {
  pgm.dropFunction('add_new_token_owner');
};
