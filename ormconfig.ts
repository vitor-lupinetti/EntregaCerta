let ormConfig = {
    entities: [
        "./src/entities/*.ts"
    ],
    migrations: [
        "./src/database/migrations/*.ts"
    ],
    cli: {
        "migrationsDir": "./src/database/migrations"
    }
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
} else {
    let databaseFileName = "database";

    if (process.env.ENV === "test") {
        databaseFileName += ".test";
    }

    ormConfig = Object.assign(ormConfig, {
        type: "sqlite",
        database: `./src/database/${databaseFileName}.sqlite`
    });
}

module.exports = ormConfig;
