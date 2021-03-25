import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomers1616124502161 implements MigrationInterface {
    private tableName = "tbCustomers";

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
                        name: "idAddress",
                        type: "uuid"
                    },
                    {
                        name: "complement",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "contactNumber",
                        type: "varchar"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "hasWhatsApp",
                        type: "char"
                    },
                    {
                        name: "homeNUmber",
                        type: "varchar"
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                    {
                        name: "photo",
                        type: "varchar"
                    }
                ],
                foreignKeys: [
                    {
                        name: "fk_tbUsers",
                        referencedTableName: "tbUsers",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "id"
                        ],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    },
                    {
                        name: "fk_tbAddresses",
                        referencedTableName: "tbAddresses",
                        referencedColumnNames: [
                            "id"
                        ],
                        columnNames: [
                            "idAddress"
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
