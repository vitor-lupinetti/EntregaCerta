import { Request, Response } from 'express';

import { UserEntity } from '../entities/UserEntity';
import UserService from '../services/UserService';

function fillUserToSave(request: Request): UserEntity {
    const { user, password, idUserType } = request.body;

    const userEntity = new UserEntity();
    userEntity.idUserType = idUserType;
    userEntity.password = password;
    userEntity.user = user;

    return userEntity;
}

class UserController {
    async create(request: Request, response: Response) {
        const userToCreate = fillUserToSave(request);

        const userService = new UserService();

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

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const userService = new UserService();

        await userService.delete(id);

        return response.status(200).json({ message: "Usuário apagado com sucesso" });
    }
}

export default UserController;
