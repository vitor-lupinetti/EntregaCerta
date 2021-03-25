import { getRepository } from "typeorm";

import { UserTypeEntity } from "../entities/UserTypeEntity";
import { GenericService } from "./Service";
import { UserTypeValidation } from "./validations/UserTypeService";

class UserTypeService extends GenericService<UserTypeEntity>{
    constructor() {
        super(getRepository(UserTypeEntity), new UserTypeValidation());
    }
}

export default UserTypeService;
