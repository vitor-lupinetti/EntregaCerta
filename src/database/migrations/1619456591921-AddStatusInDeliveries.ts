import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { EnumDeliveryStatus } from "../../enums/EnumDeliveryStatus";

export class AddStatusInDeliveries1619456591921 implements MigrationInterface {
    private tableName = "tbDeliveries";
    private columnName = "status";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(this.tableName, new TableColumn({
            name: this.columnName,
            type: "varchar",
            default: `'${EnumDeliveryStatus.CREATED}'`
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(this.tableName, this.columnName);
    }
}
