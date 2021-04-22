import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { v4 as uuid } from "uuid";

export class CreateUsers1616039746168 implements MigrationInterface {
    private tableName = "tbUsers";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "idUserType",
                        type: "uuid"
                    },
                    {
                        name: "password",
                        type: "varchar"
                    },
                    {
                        name: "user",
                        type: "varchar"
                    }
                ],
                foreignKeys: [
                    {
                        name: "fk_tbUserTypes",
                        referencedTableName: "tbUserTypes",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idUserType"
                        ],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}