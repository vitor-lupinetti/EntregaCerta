import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAddresses1616124164289 implements MigrationInterface {
    private tableName = "tbAddresses";

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
                        name: "idNeighborhood",
                        type: "uuid"
                    },
                    {
                        name: "cep",
                        type: "varchar"
                    },
                    {
                        name: "street",
                        type: "varchar"
                    }
                ],
                foreignKeys: [
                    {
                        name: "fk_tbNeighborhoods",
                        referencedTableName: "tbNeighborhoods",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idNeighborhood"
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
