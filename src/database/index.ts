import path from "path";
import { Connection, ConnectionOptions, createConnection } from "typeorm";

export default async (): Promise<Connection> => {
    let ormconfig: ConnectionOptions = {
        type: "sqlite",
        database: path.resolve("database.sqlite"),
        entities: [
            path.resolve("..", "models", "*.ts")
        ],
        migrations: [
            path.resolve("migrations", "*.ts")
        ],
        cli: {
            migrationsDir: path.resolve("migrations")
        }
    };

    if (process.env.ENV === "prod") {
        ormconfig = {
            ...ormconfig,
            type: "postgres",
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        }
    }

    return await createConnection(ormconfig);
}
