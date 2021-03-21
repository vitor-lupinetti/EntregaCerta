import { Repository } from "typeorm";

import { UserTypeEntity } from "../entities/UserTypeEntity";
import { GenericService } from "./Service";
import { UserTypeValidation } from "./validations/UserTypeService";

class UserTypeService extends GenericService<UserTypeEntity>{
    constructor(repo: Repository<UserTypeEntity>) {
        super(repo, new UserTypeValidation());
    }
}

export default UserTypeService;
