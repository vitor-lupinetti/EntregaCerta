import { FindOneOptions, getCustomRepository } from "typeorm";

import { UserEntity } from "../entities/UserEntity";
import { GenericService } from "./Service";
import { hash, compare } from 'bcryptjs';
import { UserValidation } from "./validations/UserValidation";
import { sign } from 'jsonwebtoken';
import { CustomerEntity } from "../entities/CustomerEntity";
import { CustomerService } from "./CustomerService";
import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/UserRepository";

interface UserTokenDTO {
    user: UserEntity,
    token: string
}

interface CustomerTokenDTO {
    customer: CustomerEntity,
    token: string
}

class UserService extends GenericService<UserEntity>{
    constructor() {
        super(getCustomRepository(UserRepository), new UserValidation());
    }

    public async create(entity: UserEntity): Promise<UserEntity> {
        await this.validation.validate(this, entity);

        const hashedPassword = await hash(entity.password || "", 8);
        entity.password = hashedPassword;

        const entityCreated = this.repository.create(entity);

        await this.repository.save(entityCreated);

        return this.getUserWithoutPassword(entityCreated);
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

    public async authenticateUser(username: string, password: string): Promise<CustomerTokenDTO> {
        const user = await super.findOne({ where: { user: username }, relations: ["userTypeEntity"] });
        let passwordMatched;
        if (user) {
            passwordMatched = await compare(password, user.password || "");
        }
        if (!user || !passwordMatched) {
            throw new Error("Usuário/senha incorretos");
        }

        const userWithToken: UserTokenDTO = this.generateTokenForUser(user);
        const customerWithToken: CustomerTokenDTO = await this.returnCustomerWithToken(userWithToken);

        return customerWithToken;
    }

    public async changeUserType(user: string, userTypeId: string) {
        const userFound = await this.findOne({ where: { user } });

        if (!userFound) {
            throw new AppError('Usuário não encontrado', 404);
        }

        await (this.validation as UserValidation).validateChangeUserType(userTypeId);

        userFound.idUserType = userTypeId;
        await super.update(userFound);

        return userFound;
    }

    private generateTokenForUser(user: UserEntity): UserTokenDTO {
        const secret = process.env.JWT_SECRET || ' ';

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn: '1d',
        });


        const userWithToken: UserTokenDTO = {
            user,
            token
        };

        return userWithToken;
    }

    private async returnCustomerWithToken(user: UserTokenDTO): Promise<CustomerTokenDTO> {

        const customerService = new CustomerService();

        const customer = await customerService.findOne({ where: { id: user.user.id }, relations: ["userEntity", "addressEntity", "userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"] })

        const customerWithToken: CustomerTokenDTO = {
            customer,
            token: user.token
        };

        delete customerWithToken.customer.userEntity?.password;

        return customerWithToken;

    }

    private async getUserWithoutPassword(entity: UserEntity) {
        delete entity.password;
        return entity;
    }


}

export default UserService;
