import { Request, Response } from 'express';
import { getRepository } from "typeorm";

import { UserTypeEntity } from "../entities/UserTypeEntity";
import UserTypeService from '../services/UserTypeService';

class UserTypeController {
    async list(request: Request, response: Response) {
        const userTypeRepository = getRepository(UserTypeEntity);
        const userTypeService = new UserTypeService(userTypeRepository);

        let users = await userTypeService.list();

        return response.status(200).json(users);
    };
}

export default UserTypeController;
