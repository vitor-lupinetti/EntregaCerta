import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameFieldNameToPhotoInDeliveryPhotos1618406208903 implements MigrationInterface {
    private tableName = "tbDeliveryPhotos";
    private oldColumnName = "name";
    private newColumnName = "photo";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn(this.tableName, this.oldColumnName, this.newColumnName);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn(this.tableName, this.newColumnName, this.oldColumnName);
    }
}
