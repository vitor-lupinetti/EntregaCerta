import { NextFunction, Request, Response } from 'express';

import { TokenService } from '../services/TokenService'

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    const tokenService = new TokenService();

    await tokenService.ensureAuthenticated(authHeader);

    next();
}
