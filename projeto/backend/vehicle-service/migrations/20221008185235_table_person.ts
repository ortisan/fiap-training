import { Knex } from "knex";

const UP_SCRIPT = `
CREATE TABLE PERSON (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200)
);
`
const DOWN_SCRIPT = `
DROP TABLE PERSON;
`

export async function up(knex: Knex): Promise<void> {
    return knex.raw(UP_SCRIPT);
}

export async function down(knex: Knex): Promise<void> {
    return knex.raw(DOWN_SCRIPT);
}

