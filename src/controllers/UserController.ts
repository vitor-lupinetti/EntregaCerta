import { Request, Response } from 'express';
import { UserEntity } from '../entities/UserEntity';
import { getRepository } from 'typeorm';
import UserService from '../services/UserService';


class UserController {

    // private userService: UserService;

    constructor(){
        // const userRepository = getRepository(UserEntity);
        // this.userService = new UserService(userRepository);
    }
    async create(request: Request, response: Response) {
        const { user, password, idUserType } = request.body;
        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);
        try {
            const userToCreate: UserEntity = { password, user, idUserType };
            const userCreated = await userService.create(userToCreate);
            return response.status(201).json(userCreated);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }

    async list(request: Request, response: Response) {
        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);


        let users = await userService.list({ relations: ["userTypeEntity"] });
        return response.status(200).json(users);
    };

    async getUserByUsername(request: Request, response: Response){
        const { username } = request.params;

        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);

        let userFound = await userService.findOne({where: {user:username}, relations: ["userTypeEntity"]});

        if(userFound){
            return response.status(200).json(userFound);
        }

        return response.status(404).json({error: "Usuário não encontrado"});
    }

    async authenticateUser(request: Request, response: Response){
        const {user, password} = request.body;
        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);

        try {
           const userAuthenticated = await userService.authenticateUser(user, password);
           return response.status(201).json(userAuthenticated);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    }
}

export default UserController;