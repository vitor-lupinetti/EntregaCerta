import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDeliveryPhotos1617303590858 implements MigrationInterface {
    private tableName = "tbDeliveryPhotos";

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
                        name: "name",
                        type: "varchar"
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
