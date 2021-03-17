import express from 'express';
import "reflect-metadata";
import { getConnection, QueryBuilder } from "typeorm";

import createConnection from "./database";
import { Ator } from "./models/Ator";

createConnection();

const app = express();
const port = process.env.PORT || 3333;

app.get('/', (request, response) => {
    return response.json({ message: "Entrega certa!" });
});

app.get('/teste', (request, response) => {
    return response.json({ message: "Entrega testada!" });
});

app.get('/ler', (request, response) => {
    const Pool = require('pg').Pool
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    })

    pool.query('SELECT * FROM atores', (error, results) => {
        if (error) {
            throw error
        }

        return response.status(200).json(results.rows)
    })
});

app.listen(port, () => {
    console.log('Server is running!!!');
});