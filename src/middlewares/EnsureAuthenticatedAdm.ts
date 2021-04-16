import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { TokenService } from '../services/TokenService';
import UserService from '../services/UserService';

interface IPayload{
    sub: string;
}
export async function ensureAuthenticatedAdm(request: Request, response:Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    const tokenService = new TokenService();

    const user = await tokenService.ensureAuthenticated(authHeader);

    
    if(user.userTypeEntity?.description != "ADM"){
        throw new AppError("Somente um adm tem permissão para acessar essa rota!!", 401);
    }

    next();
}