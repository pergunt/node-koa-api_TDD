const bcrypt = require('bcrypt');

exports.seed = (knex) => {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync('johnson', salt);

  return knex('users').del()
    .then(() =>
      knex('users').insert({
        username: 'jeremy',
        password: hash
      })
    );
};
