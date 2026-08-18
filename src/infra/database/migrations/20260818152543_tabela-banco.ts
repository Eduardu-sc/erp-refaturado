import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('banco', (table: Knex.TableBuilder) => {
    table.increments('id').primary()
    table.string('codigo').notNullable()
    table.string('nome').notNullable()
    table.string('url').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('banco')
}
