import { getCustomRepository } from "typeorm";

import { UserTypeEntity } from "../entities/UserTypeEntity";
import { UserTypeRepository } from "../repositories/UserTypeRepository";
import { GenericService } from "./Service";
import { UserTypeValidation } from "./validations/UserTypeValidation";

class UserTypeService extends GenericService<UserTypeEntity>{
    constructor() {
        super(getCustomRepository(UserTypeRepository), new UserTypeValidation());
    }
}

export default UserTypeService;
