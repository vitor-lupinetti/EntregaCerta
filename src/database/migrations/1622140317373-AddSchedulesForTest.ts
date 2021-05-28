import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";

export class AddSchedulesForTest1622140317373 implements MigrationInterface {
    private tableName = "tbSchedules";

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        let delivery = (await queryRunner.query("SELECT * FROM tbDeliveries WHERE description = 'deliverytest1';"))[0];
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        let dateTomorrow = tomorrow.toISOString().replace(/T.*/, "");
        let timeTomorrow = tomorrow.toISOString().replace(/.*T/, "").replace(/\..*/, "");

        await queryRunner.query(
            `INSERT INTO ${this.tableName} ` +
            `   (id, idDelivery, date, place, time) ` +
            `VALUES ` +
            `   ('${uuid()}', '${delivery.id}', '${dateTomorrow}', 'placescheduletest1', '${timeTomorrow}');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        await queryRunner.query(`DELETE FROM ${this.tableName} WHERE place = 'placescheduletest1';`);
    }
}
