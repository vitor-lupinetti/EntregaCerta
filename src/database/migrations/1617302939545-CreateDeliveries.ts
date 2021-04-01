import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDeliveries1617302939545 implements MigrationInterface {
    private tableName = "tbDeliveries";

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
                        name: "idBuyer",
                        type: "uuid"
                    },
                    {
                        name: "idReceiver",
                        type: "uuid"
                    },
                    {
                        name: "amountPackaging",
                        type: "int"
                    },
                    {
                        name: "purchaseDate",
                        type: "date"
                    },
                    {
                        name: "receiptDate",
                        type: "date"
                    },
                    {
                        name: "receptionTime",
                        type: "time"
                    }
                ],
                foreignKeys: [
                    {
                        name: "fk_tbCustomers_buyer",
                        referencedTableName: "tbCustomers",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idBuyer"
                        ],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    },
                    {
                        name: "fk_tbCustomers_receiver",
                        referencedTableName: "tbCustomers",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idReceiver"
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
