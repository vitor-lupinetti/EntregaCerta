import express, { NextFunction, Request, Response } from 'express';
import "express-async-errors";
import "reflect-metadata";
require('dotenv/config');
import cors from 'cors';

import "./database";
import { router } from './routes';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';
import { AppError } from './errors/AppError';
import { ValidationError } from 'yup';



var options = {
    swaggerOptions: {
      authAction :{ JWT: {name: "JWT", schema: {type: "apiKey", in: "header", name: "Authorization", description: ""}, value: "Bearer <JWT>"} }
    }
};

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, options))
app.use(router);
app.use('/uploads/', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use((error: Error, request: Request, response: Response, _next: NextFunction) => {
    let statusCode = 500;
    let errorMessage: string | Array<string> = `Internal server error: ${error.message}`;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorMessage = error.message;

    } else if (error instanceof ValidationError) {
        statusCode = 400;
        errorMessage = error.errors;
    }

    return response.status(statusCode).json({ error: errorMessage });
});

export default app;
