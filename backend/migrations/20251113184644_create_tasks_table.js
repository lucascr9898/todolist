// <data>_create_tasks_table.js (Verifique o nome exato do seu arquivo)

export function up(knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.boolean('completed').defaultTo(false);
    
    // CRUCIAL: Adiciona created_at e updated_at
    table.timestamps(true, true); 
  });
}

export function down(knex) {
  return knex.schema.dropTable('tasks');
}
