import { MigrationInterface, QueryRunner } from "typeorm";
export class AddCustomersForTest1622072599846 implements MigrationInterface {
    private tableName = "tbCustomers";

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        let userBuyer = (await queryRunner.query("SELECT * FROM tbUsers WHERE user = 'usertest1';"))[0];
        let userReceiver = (await queryRunner.query("SELECT * FROM tbUsers WHERE user = 'usertest2';"))[0];
        let address = (await queryRunner.query("SELECT * FROM tbAddresses WHERE street = 'streettest1';"))[0];

        await queryRunner.query(
            `INSERT INTO ${this.tableName} ` +
            `   (id, idAddress, complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo, photoMimeType) ` +
            `VALUES ` +
            `   ('${userBuyer.id}', '${address.id}', '', '11111111', '', '0', '111', 'clienttest1', '', ''), ` +
            `   ('${userReceiver.id}', '${address.id}', '', '22222222', '', '0', '222', 'clienttest2', '', '');`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        if (process.env.ENV !== "test") {
            return;
        }

        await queryRunner.query(`DELETE FROM ${this.tableName} WHERE name IN ('clienttest1', 'clienttest2');`);
    }
}
