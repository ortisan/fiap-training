import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgres",
    connection: {
      host : '127.0.0.1',
      port : 5432,
      database: "postgres",
      user: "postgres",
      password: "123456789"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      host : '127.0.0.1',
      port : 5432,
      database: "postgres",
      user: "postgres",
      password: "123456789"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      host : '127.0.0.1',
      port : 5432,
      database: "postgres",
      user: "postgres",
      password: "123456789"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

module.exports = config;
