import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import UserService from '../services/UserService';
import {TokenService} from '../services/TokenService'

interface IPayload{
    sub: string;
}
export async function ensureAuthenticated(request: Request, response:Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    const tokenService = new TokenService();

    await tokenService.ensureAuthenticated(authHeader);

    next();
}