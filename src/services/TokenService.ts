import { verify } from 'jsonwebtoken';

import { UserEntity } from '../entities/UserEntity';
import { AppError } from '../errors/AppError';
import UserService from '../services/UserService';

interface IPayload {
    sub: string;
}

export class TokenService {
    async ensureAuthenticated(authHeader: string | undefined): Promise<UserEntity> {
        if (!authHeader) {
            throw new Error("Token is missing!");
        }

        const [, token] = authHeader.split(" ");
        let user;

        try {
            const { sub } = verify(token, process.env.JWT_SECRET!) as IPayload;
            const userService = new UserService();
            user = await userService.findOne({ where: { id: sub }, relations: ["userTypeEntity"] });
        } catch {
            throw new Error("Token inválido!");
        }

        if (!user) {
            throw new AppError("Usuário não econtrado", 404);
        }

        return user;
    }
}
