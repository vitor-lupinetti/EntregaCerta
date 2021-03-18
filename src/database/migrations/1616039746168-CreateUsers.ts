import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1616039746168 implements MigrationInterface {
    private tableName = "tbUsers";

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
                        name: "idUserType",
                        type: "varchar"
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
