import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError';
import { TokenService } from '../services/TokenService';

export async function ensureAuthenticatedEcommerce(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    const tokenService = new TokenService();

    const user = await tokenService.ensureAuthenticated(authHeader);

    if (user.userTypeEntity?.description != "E-commerce") {
        throw new AppError("Somente um e-commerce tem permissão para acessar essa rota!!", 401);
    }

    next();
}
