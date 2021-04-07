import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class BecomeSomeColumnsOfDeliveryAsNullable1617817514095 implements MigrationInterface {
    private tableName = "tbDeliveries";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumns(this.tableName, [
            {
                oldColumn: new TableColumn({
                    name: "amountPackaging",
                    type: "int"
                }),
                newColumn: new TableColumn({
                    name: "amountPackaging",
                    type: "int",
                    isNullable: true
                })
            },
            {
                oldColumn: new TableColumn({
                    name: "receiptDate",
                    type: "date"
                }),
                newColumn: new TableColumn({
                    name: "receiptDate",
                    type: "date",
                    isNullable: true
                })
            },
            {
                oldColumn: new TableColumn({
                    name: "receptionTime",
                    type: "time"
                }),
                newColumn: new TableColumn({
                    name: "receptionTime",
                    type: "time",
                    isNullable: true
                })
            }
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumns(this.tableName, [
            {
                oldColumn: new TableColumn({
                    name: "amountPackaging",
                    type: "int"
                }),
                newColumn: new TableColumn({
                    name: "amountPackaging",
                    type: "int",
                    isNullable: false
                })
            },
            {
                oldColumn: new TableColumn({
                    name: "receiptDate",
                    type: "date"
                }),
                newColumn: new TableColumn({
                    name: "receiptDate",
                    type: "date",
                    isNullable: false
                })
            },
            {
                oldColumn: new TableColumn({
                    name: "receptionTime",
                    type: "time"
                }),
                newColumn: new TableColumn({
                    name: "receptionTime",
                    type: "time",
                    isNullable: false
                })
            }
        ]);
    }
}
