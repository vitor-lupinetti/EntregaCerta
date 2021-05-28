import { MigrationInterface, QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";
import { EnumDeliveryStatus } from "../../enums/EnumDeliveryStatus";

export class AddDeliveriesForTest1622077448544 implements MigrationInterface {
    private tableName = "tbDeliveries";

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        let customerBuyer = (await queryRunner.query("SELECT * FROM tbCustomers WHERE name = 'clienttest1';"))[0];
        let customerReceiver = (await queryRunner.query("SELECT * FROM tbCustomers WHERE name = 'clienttest2';"))[0];
        let now = new Date();
        let dateNow = now.toISOString().replace(/T.*/, "");
        let timeNow = now.toISOString().replace(/.*T/, "").replace(/\..*/, "");

        await queryRunner.query(
            `INSERT INTO ${this.tableName} ` +
            `   (id, idBuyer, idReceiver, description, purchaseDate, purchaseTime, status) ` +
            `VALUES ` +
            `   ('${uuid()}', '${customerBuyer.id}', '${customerReceiver.id}', 'deliverytest1', '${dateNow}', '${timeNow}', '${EnumDeliveryStatus.RECEIVER_RECEIVED}');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        await queryRunner.query(`DELETE FROM ${this.tableName} WHERE description = 'deliverytest1';`);
    }
}
