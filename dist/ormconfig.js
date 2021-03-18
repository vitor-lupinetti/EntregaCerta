"use strict";
var ormConfig = {
    entities: [
        "./src/entities/*.ts"
    ],
    migrations: [
        "./src/database/migrations/*.ts"
    ],
    cli: {
        "migrationsDir": "./src/database/migrations"
    },
};
if (process.env.ENV === "prod") {
    ormConfig = Object.assign(ormConfig, {
        type: "postgres",
        url: process.env.DATABASE_URL,
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    });
}
else {
    ormConfig = Object.assign(ormConfig, {
        type: "sqlite",
        database: "./src/database/database.sqlite"
    });
}
module.exports = ormConfig;
