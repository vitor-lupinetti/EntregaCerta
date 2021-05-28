import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";

export class AddNeighborhoodsForTest1622072573046 implements MigrationInterface {
    private tableName = "tbNeighborhoods";

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        await queryRunner.query(
            `INSERT INTO ${this.tableName} ` +
            `   (id, name) ` +
            `VALUES ` +
            `   ('${uuid()}', 'neighborhoodtest1');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name = 'neighborhoodtest1';`);
    }
}
