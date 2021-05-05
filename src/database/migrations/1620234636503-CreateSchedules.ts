import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSchedules1620234636503 implements MigrationInterface {
    private tableName = "tbSchedules";

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
                        name: "idDelivery",
                        type: "uuid"
                    },
                    {
                        name: "date",
                        type: "date"
                    },
                    {
                        name: "place",
                        type: "varchar"
                    },
                    {
                        name: "reason",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "time",
                        type: "time"
                    }
                ],
                foreignKeys: [
                    {
                        name: "fk_tbDeliveries",
                        referencedTableName: "tbDeliveries",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idDelivery"
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
