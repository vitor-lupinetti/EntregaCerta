import express from 'express';
import "reflect-metadata";
import { getConnection, QueryBuilder } from "typeorm";
require('dotenv/config');

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
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
        connectionString,
        ssl:{
            rejectUnauthorized: false
        }
    })

    pool.query('SELECT * FROM tbl_autores', (error: any, results: { rows: any; }) => {
        if (error) {
            throw error
        }

        return response.status(200).json(results.rows)
    })
});

app.listen(port, () => {
    console.log('Server is running!!!');
});