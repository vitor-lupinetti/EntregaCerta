import { Request, Response } from 'express';

import { UserEntity } from '../entities/UserEntity';
import UserService from '../services/UserService';

class UserController {
    async create(request: Request, response: Response) {
        const { user, password, idUserType } = request.body;

        const userService = new UserService();

        const userToCreate: UserEntity = { password, user, idUserType };
        const userCreated = await userService.create(userToCreate);

        return response.status(201).json(userCreated);
    }

    async list(request: Request, response: Response) {
        const userService = new UserService();

        let users = await userService.list({ relations: ["userTypeEntity"] });

        return response.status(200).json(users);
    };

    async getUserByUsername(request: Request, response: Response) {
        const { username } = request.params;

        const userService = new UserService();

        let userFound = await userService.findOne({ where: { user: username }, relations: ["userTypeEntity"] });

        if (userFound) {
            return response.status(200).json(userFound);
        }

        return response.status(404).json({ error: "Usuário não encontrado" });
    }

    async authenticateUser(request: Request, response: Response) {
        const { user, password } = request.body;

        const userService = new UserService();

        const userAuthenticated = await userService.authenticateUser(user, password);

        return response.status(200).json(userAuthenticated);
    }
}

export default UserController;
