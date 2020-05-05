exports.up = (knex, Promise) => {
  return knex.schema.createTable('movies', table => {
    table.increments();
    table.string('name').notNullable().unique();
    table.string('genre').notNullable();
    table.integer('rating').notNullable();
    table.boolean('explicit').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('movies');
};
