import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPurchaseTimeInDeliveries1619888977055 implements MigrationInterface {
    private tableName = "tbDeliveries";
    private columnName = "purchaseTime";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(this.tableName, new TableColumn({
            name: this.columnName,
            type: "time"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(this.tableName, this.columnName);
    }
}
