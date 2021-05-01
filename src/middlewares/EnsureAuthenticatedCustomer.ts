import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError';
import { TokenService } from '../services/TokenService';

export async function ensureAuthenticatedCustomer(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;
    const tokenService = new TokenService();

    const user = await tokenService.ensureAuthenticated(authHeader);
    let userDescription = user.userTypeEntity?.description;

    if (userDescription != "Buyer" && userDescription != "Receiver") {
        throw new AppError("Somente um comprador tem permissão para acessar essa rota!!", 401);
    }

    next();
}