import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import UserService from '../services/UserService';

interface IPayload{
    sub: string;
}
export async function ensureAuthenticatedCustomer(request: Request, response:Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new Error("Token is missing!");
    }

    const [ , token] = authHeader.split(" ");
    let user;
    
    try {
        const {sub} = verify(token, process.env.JWT_SECRET!) as IPayload;
        const userService = new UserService();
        user = await userService.findOne({where: {id: sub}, relations: ["userTypeEntity"]});
    } catch  {
        throw new Error("Token inválido!");
    }

    if(!user){
        throw new AppError("Usuário não econtrado", 404);
    }

    let userDescription = user.userTypeEntity?.description;

    if(userDescription != "Buyer" && userDescription != "Receiver"){
        throw new AppError("Somente um comprador tem permissão para acessar essa rota!!", 401);
    }

    next();
}