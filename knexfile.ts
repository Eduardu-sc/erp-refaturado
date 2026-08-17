import type { Knex } from 'knex'

export default {
  client: 'mysql2',
  connection: 'mysql://root:root@localhost/test-db',
  migrations: {
    directory: './src/infra/database/migrations',
  },
} satisfies Knex.Config
