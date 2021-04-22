import { NextFunction, Request, Response } from "express";
import { ValidationError } from "yup";

import { AppError } from "../errors/AppError";

export function catchErrors(error: Error, request: Request, response: Response, next: NextFunction) {
    let statusCode = 500;
    let errorMessage: string | string[] = `Internal server error: ${error.message}`;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorMessage = error.message;
    } else if (error instanceof ValidationError) {
        statusCode = 400;
        errorMessage = error.errors;
    }

    return response.status(statusCode).json({ error: errorMessage });
}
