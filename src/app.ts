import express, { request, response } from 'express';
import "reflect-metadata";
require('dotenv/config');

import "./database";
import { router } from './routes';

const app = express();
app.use(express.json());
app.use(router);

export default app;