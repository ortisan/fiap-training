import { Knex } from "knex";

const UP_SCRIPT = `
CREATE TABLE ADDRESS (
    id VARCHAR(36) PRIMARY KEY,
    line1 VARCHAR(200),
    line2 VARCHAR(200)
);
`
const DOWN_SCRIPT = `
DROP TABLE ADDRESS;
`

export async function up(knex: Knex): Promise<void> {
    return knex.raw(UP_SCRIPT);
}


export async function down(knex: Knex): Promise<void> {
    return knex.raw(DOWN_SCRIPT);
}

