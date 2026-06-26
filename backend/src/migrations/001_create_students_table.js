exports.up = function (knex) {
  return knex.schema.createTable('students', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone', 20);
    table.date('enrollment_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'));
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    // Indexes
    table.index('email');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('students');
};
