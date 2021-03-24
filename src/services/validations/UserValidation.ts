import { getRepository } from "typeorm";
import * as yup from "yup";

import { UserEntity } from "../../entities/UserEntity"
import { UserTypeEntity } from "../../entities/UserTypeEntity";
import UserService from "../UserService";
import UserTypeService from "../UserTypeService";
import { Validation } from "./Validation";

export class UserValidation extends Validation<UserEntity> {
    public async validate(service: UserService, user: UserEntity): Promise<void> {
        await this.validateFields(user);
        await this.verifyUserExists(service, user.user);
    }

    protected async validateFields(user: UserEntity): Promise<void> {
        const schema = yup.object().shape({
            user: yup.string().trim().required("Usuário inválido"),
            idUserType: yup.string().trim().required("Tipo do usuário inválido"),
            password: yup.string().trim().min(5).required("Senha inválida."),
        })

        await schema.validate(user, this.validateOptions)

        await this.verifyUserTypeExists(user.idUserType);
    }

    protected async verifyUserExists(service: UserService, username: string): Promise<void> {
        const userFind = await service.findOne({ where: { user: username } });

        if (userFind) {
            throw new Error("Esse usuário já está sendo utilizado!");
        }
    }

    protected async verifyUserTypeExists(idUserType: string) {
        const userTypeRepository = getRepository(UserTypeEntity);
        const userTypeService = new UserTypeService(userTypeRepository);

        const userTypeFound = await userTypeService.findOne({ where: { id: idUserType } });

        if (!userTypeFound) {
            throw new Error("Tipo de usuário não encontrado");
        }
    }
}
