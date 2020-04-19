exports.up = (knex, Promise) => {
  console.log('create table users');
  return knex.schema.createTable('users', table => {
    table.increments();
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
  });
};

exports.down = knex => {
  console.log('delete users');
  return knex.schema.dropTable('users');
};
