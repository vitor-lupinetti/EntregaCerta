import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPhotoMimeType1617667168120 implements MigrationInterface {
    private columnName = "photoMimeType";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("tbCustomers", new TableColumn({
            name: this.columnName,
            type: "string",
        }));

        await queryRunner.addColumn("tbDeliveryPhotos", new TableColumn({
            name: this.columnName,
            type: "string",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("tbCustomers", this.columnName);

        await queryRunner.dropColumn("tbDeliveryPhotos", this.columnName);
    }
}
