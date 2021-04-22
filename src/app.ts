import cors from 'cors';
import express from 'express';
import "express-async-errors";
import "reflect-metadata";
import swaggerUi from 'swagger-ui-express';
require('dotenv/config');

import "./database";
import { catchErrors } from './middlewares/CatchErrors';
import { router } from './routes';
import swaggerFile from './swagger.json';

var options = {
    swaggerOptions: {
        authAction: {
            JWT: {
                name: "JWT",
                schema: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                    description: ""
                },
                value: "Bearer <JWT>"
            }
        }
    }
};

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, options));
app.use(router);

app.use(catchErrors);

export default app;
