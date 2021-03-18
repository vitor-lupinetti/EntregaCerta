import express from 'express';
import "reflect-metadata";
import { getCustomRepository } from 'typeorm';
require('dotenv/config');

import "./database";
import { UserTypeRepository } from './repositories/UserTypeRepository';

const app = express();
const port = process.env.PORT || 3333;

app.get('/', (request, response) => {
    return response.json({ message: "Entrega certa!" });
});

app.get('/teste', (request, response) => {
    return response.json({ message: "Entrega testada!" });
});

app.get('/ler', async (request, response) => {
    /*
    const Pool = require('pg').Pool
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    })

    pool.query('SELECT * FROM tbl_autores', (error: any, results: { rows: any; }) => {
        if (error) {
            throw error
        }

        return response.status(200).json(results.rows)
    })
    */

    let repository = getCustomRepository(UserTypeRepository);
    let userTypes = await repository.find();

    return response.status(200).json(userTypes);
});

app.listen(port, () => {
    console.log('Server is running!!!');
});
