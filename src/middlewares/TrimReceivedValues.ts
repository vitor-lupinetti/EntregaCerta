import { NextFunction, Request, Response } from "express";

export async function trimReceivedValues(request: Request, response: Response, next: NextFunction) {
    if (request.body) {
        Object.keys(request.body).forEach(key => {
            if (typeof request.body[key] === "string") {
                request.body[key] = request.body[key].trim();
            }
        });
    }

    if (request.params) {
        Object.keys(request.params).forEach(key => {
            request.params[key] = request.params[key].trim();
        });
    }

    next();
}
