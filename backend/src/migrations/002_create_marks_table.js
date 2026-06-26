exports.up = function (knex) {
  return knex.schema.createTable('marks', (table) => {
    table.increments('id').primary();
    table
      .integer('student_id')
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');
    table.string('subject', 100).notNullable();
    table.decimal('score', 5, 2).notNullable();
    table.date('exam_date').notNullable().defaultTo(knex.raw('CURRENT_DATE'));
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    // Constraints and Indexes
    table.index('student_id');
    table.unique(['student_id', 'subject']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('marks');
};
