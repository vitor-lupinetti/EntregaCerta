import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";

export class AddAddressesForTest1622072584248 implements MigrationInterface {
    private tableName = "tbAddresses";

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        let neighborhood = (await queryRunner.query("SELECT * FROM tbNeighborhoods WHERE name = 'neighborhoodtest1';"))[0];

        await queryRunner.query(
            `INSERT INTO ${this.tableName} ` +
            `   (id, idNeighborhood, cep, street) ` +
            `VALUES ` +
            `   ('${uuid()}', '${neighborhood.id}', '11111111', 'streettest1');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        await queryRunner.query(`DELETE FROM ${this.tableName} WHERE street = 'streettest1';`);
    }
}
