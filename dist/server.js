"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require("reflect-metadata");
var database_1 = __importDefault(require("./database"));
database_1.default();
var app = express_1.default();
var port = process.env.PORT || 3333;
app.get('/', function (request, response) {
    return response.json({ message: "Entrega certa!" });
});
app.get('/teste', function (request, response) {
    return response.json({ message: "Entrega testada!" });
});
app.get('/ler', function (request, response) {
    var Pool = require('pg').Pool;
    var pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });
    pool.query('SELECT * FROM atores', function (error, results) {
        if (error) {
            throw error;
        }
        return response.status(200).json(results.rows);
    });
});
app.listen(port, function () {
    console.log('Server is running!!!');
});
