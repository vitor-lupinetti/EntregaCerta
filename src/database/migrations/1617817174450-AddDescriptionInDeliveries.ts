import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDescriptionInDeliveries1617817174450 implements MigrationInterface {
    private tableName = "tbDeliveries";
    private columnName = "description";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(this.tableName, new TableColumn({
            name: this.columnName,
            type: "varchar"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(this.tableName, this.columnName);
    }
}
