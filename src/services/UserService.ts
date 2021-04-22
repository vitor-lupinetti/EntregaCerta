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

    public async create(user: UserEntity): Promise<UserEntity> {
        this.validation.ableThrowErrors();
        await this.validation.validateCreate(this, user);

        const hashedPassword = await hash(user.password || "", 8);
        user.password = hashedPassword;

        const userCreated = await this.repository.save(user);

        return this.getUserWithoutPassword(userCreated);
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

    public async authenticateUser(username: string, password: string): Promise<CustomerTokenDTO | UserTokenDTO> {
        let user = await super.findOne({ where: { user: username }, relations: ["userTypeEntity"] });
        let passwordMatched;

        if (user) {
            passwordMatched = await compare(password, user.password || "");
        }

        if (!passwordMatched) {
            throw new AppError("Usuário/senha incorretos");
        }

        user = await this.getUserWithoutPassword(user);

        const userWithToken: UserTokenDTO = this.generateTokenForUser(user);

        if (user.userTypeEntity?.description === "ADM" || user.userTypeEntity?.description === "E-commerce") {
            return userWithToken;
        }

        const customerWithToken: CustomerTokenDTO = await this.returnCustomerWithToken(userWithToken);

        return customerWithToken;
    }

    public async changeUserType(user: string, idUserType: string) {
        const userFound = await this.findOne({ where: { user } });

        if (!userFound) {
            throw new AppError('Usuário não encontrado', 404);
        }

        await (this.validation as UserValidation).validateChangeUserType(idUserType);

        userFound.idUserType = idUserType;
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

        let customer = await customerService.findOne({
            where: { id: user.user.id },
            relations: ["addressEntity", "addressEntity.neighborhoodEntity"]
        });
        customer.userEntity = user.user;

        const customerWithToken: CustomerTokenDTO = {
            customer,
            token: user.token
        };

        return customerWithToken;
    }

    private async getUserWithoutPassword(entity: UserEntity) {
        delete entity.password;
        return entity;
    }

    public async onlyValidateCreate(user: UserEntity): Promise<string[]> {
        this.validation.disableThrowErrors();
        await this.validation.validateCreate(this, user);

        return this.validation.getErrors();
    }
}

export default UserService;
