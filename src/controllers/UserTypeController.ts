import { Request, Response } from 'express';

import UserTypeService from '../services/UserTypeService';

class UserTypeController {
    async list(request: Request, response: Response) {
        const userTypeService = new UserTypeService();

        let users = await userTypeService.list();

        return response.status(200).json(users);
    };
}

export default UserTypeController;
