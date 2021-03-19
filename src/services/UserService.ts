import { FindOneOptions, Repository } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import { GenericService } from "./Service";
import { hash } from 'bcryptjs';
import { validateUser } from './validations/UserValidations';

class UserService extends GenericService<UserEntity>{
    constructor(repo: Repository<UserEntity>) {
        super(repo);
    }

    public async create(entity: UserEntity): Promise<UserEntity>{
        await validateUser(this, entity);

        const hashedPassword = await hash(entity.password || "", 8);
        entity.password = hashedPassword;

        return this.getUserWithoutPassword(await super.create(entity));
    }

    public async list(options?: FindOneOptions<UserEntity> ): Promise<UserEntity[]>{
        const users = await super.list(options);
        const usersWithoutPass:UserEntity[] = [];

        users.forEach(async user => {
            let userReturn = await this.getUserWithoutPassword(user);
            usersWithoutPass.push(userReturn);
        });

        return usersWithoutPass;
    }

    private async getUserWithoutPassword(entity: UserEntity){
        delete entity.password;
        return entity;
    }

}

export default UserService;