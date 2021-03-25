import { MigrationInterface, QueryRunner } from "typeorm";

import { CreateOtherContacts1616124816348 } from "./1616124816348-CreateOtherContacts";

export class DeleteOtherContacts1616674194846 implements MigrationInterface {
    private tableName = "tbOtherContacts";

    public async up(queryRunner: QueryRunner): Promise<void> {
        let migrationCreateOtherContacts = new CreateOtherContacts1616124816348();
        await migrationCreateOtherContacts.down(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        let migrationCreateOtherContacts = new CreateOtherContacts1616124816348();
        await migrationCreateOtherContacts.up(queryRunner);
    }
}
