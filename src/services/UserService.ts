import { Repository } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import { GenericService } from "./Service";


class UserService extends GenericService<UserEntity>{
    private userRepository: Repository<UserEntity>;
    constructor(repo: Repository<UserEntity>){
        super(repo);
        this.userRepository = repo;
    }

}

export default UserService;