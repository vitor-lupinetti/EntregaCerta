import { Request, Response } from 'express';
import { UserEntity } from '../entities/UserEntity';
import { UserRepository } from '../repositories/UserRepository';
import { getConnection, getCustomRepository, getRepository } from 'typeorm';
import UserService from '../services/UserService';


class UserController{
   
    async create(request:Request, response:Response){
        const {user ,password, idUserType} = request.body;

        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);

        try{
            const userToCreate:UserEntity = {password, user, idUserType};
            const userCreated = await userService.create(userToCreate);
            return response.status(201).json(userCreated);
        }catch(err){
            return response.status(400).json({error: err.message});
        }
    }

    async list(request:Request, response: Response) {

        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);

        let users = await userService.list({relations: ["userTypeEntity"]});
        return response.status(200).json(users);
        
    };
}

export default UserController;