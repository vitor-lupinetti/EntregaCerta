import { FindOneOptions, getRepository, Repository } from "typeorm";

import { UserEntity } from "../entities/UserEntity";
import { GenericService } from "./Service";
import { hash, compare } from 'bcryptjs';
import { UserValidation } from "./validations/UserValidation";
import { CustomerEntity } from "../entities/CustomerEntity";
import { CustomerService } from "./CustomerService";

class UserService extends GenericService<UserEntity>{
    constructor(repo: Repository<UserEntity>) {
        super(repo, new UserValidation());
    }

    public async create(entity: UserEntity): Promise<UserEntity> {
        await this.validation.validate(this, entity);

        const hashedPassword = await hash(entity.password || "", 8);
        entity.password = hashedPassword;

        const entityCreated = this.repository.create(entity);

        // await this.repository.save(entityCreated);

        // return this.getUserWithoutPassword(entityCreated);
        return entityCreated;
    }

    public async createCustomer(customer:CustomerEntity){
        const userCreated = await this.create(customer.userEntity || new UserEntity());
        
        const customerRepository = getRepository(CustomerEntity);
        const customerService = new CustomerService(customerRepository);

        const customerCreated = await customerService.create(customer);

        await this.repository.save(userCreated);
    }

    public async list(options?: FindOneOptions<UserEntity>): Promise<UserEntity[]> {
        const users = await super.list(options);
        const usersWithoutPass: UserEntity[] = [];

        users.forEach(async user => {
            let userReturn = await this.getUserWithoutPassword(user);
            usersWithoutPass.push(userReturn);
        });

        return usersWithoutPass;
    }

    public async findOne(options?: FindOneOptions<UserEntity>): Promise<UserEntity> {
        const user = await super.findOne(options);
        if (user) {
            return this.getUserWithoutPassword(user);
        }

        return user;
    }

    public async authenticateUser(username: string, password: string) {
        const user = await super.findOne({ where: { user: username } });
        let passwordMatched;
        if (user) {
            passwordMatched = await compare(password, user.password || "");
        }
        if (!user || !passwordMatched) {
            throw new Error("Usuário/senha incorretos");
        }
        return user;
    }

    private async getUserWithoutPassword(entity: UserEntity) {
        delete entity.password;
        return entity;
    }

}

export default UserService;
