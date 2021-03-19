import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOtherContacts1616124816348 implements MigrationInterface {
    private tableName = "tbOtherContacts";

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
                        name: "idCustomer",
                        type: "uuid"
                    },
                    {
                        name: "idOtherCustomer",
                        type: "uuid"
                    }
                ],
                foreignKeys: [
                    {
                        name: "fk_tbCustomers_customer",
                        referencedTableName: "tbCustomers",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idCustomer"
                        ],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    },
                    {
                        name: "fk_tbCustomers_otherCustomer",
                        referencedTableName: "tbCustomers",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idOtherCustomer"
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
