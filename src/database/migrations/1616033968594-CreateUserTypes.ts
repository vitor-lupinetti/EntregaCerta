import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { v4 as uuid } from "uuid";

export class CreateUserTypes1616033968594 implements MigrationInterface {
    private tableName = "tbUserTypes";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true
                    },
                    {
                        name: "description",
                        type: "varchar"
                    }
                ]
            })
        );


        await queryRunner.query(
            `INSERT INTO "tbUserTypes" ` +
            `VALUES ` +
            `    ('${uuid()}', 'ADM'),` +
            `    ('${uuid()}', 'Buyer'),` +
            `    ('${uuid()}', 'E-commerce'),` +
            `    ('${uuid()}', 'Receiver');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
