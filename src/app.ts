import express, { request, response } from 'express';
import "reflect-metadata";
require('dotenv/config');

import "./database";
import { router } from './routes';
import path from 'path';

const app = express();
app.use(express.json());
app.use(router);
app.use('/uploads/', express.static(path.resolve(__dirname, '..', 'uploads')));

export default app;