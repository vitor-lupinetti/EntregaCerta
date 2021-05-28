import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";

export class AddUsersForTest1622072555526 implements MigrationInterface {
    private tableName = "tbUsers";

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        let userTypeBuyer = (await queryRunner.query("SELECT * FROM tbUserTypes WHERE description = 'Buyer';"))[0];
        let userTypeReceiver = (await queryRunner.query("SELECT * FROM tbUserTypes WHERE description = 'Receiver';"))[0];

        await queryRunner.query(
            `INSERT INTO ${this.tableName} ` +
            `   (id, idUserType, password, user) ` +
            `VALUES ` +
            `   ('${uuid()}', '${userTypeBuyer.id}', '12345', 'usertest1'), ` +
            `   ('${uuid()}', '${userTypeReceiver.id}', '12345', 'usertest2');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        await queryRunner.query(`DELETE FROM ${this.tableName} WHERE user IN ('usertest1', 'usertest2');`);
    }
}
