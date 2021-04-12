import { FindConditions, Not } from "typeorm";
import * as yup from "yup";

import { UserEntity } from "../../entities/UserEntity"
import { AppError } from "../../errors/AppError";
import UserService from "../UserService";
import UserTypeService from "../UserTypeService";
import { Validation } from "./Validation";

export class UserValidation extends Validation<UserEntity> {
    protected async validateFields(user: UserEntity, isCreate: boolean): Promise<void> {
        const schema = yup.object().shape({
            user: yup.string().max(20, "Usuário com mais de 20 caracteres").required("Usuário inválido"),
            idUserType: yup.string().required("Tipo do usuário obrigatório"),
            password: yup.string().min(5, "Senha com menos de 5 caracteres").max(20, "Senha com mais de 20 caracteres"),
        })

        await schema.validate(user, this.validateOptions)

        await this.verifyUserTypeExists(user.idUserType);
    }

    protected async verifyIfExists(service: UserService, user: UserEntity, isCreate: boolean): Promise<void> {
        let whereConditions: FindConditions<UserEntity> = {
            user: user.user
        };

        if (!isCreate) {
            whereConditions = {
                ...whereConditions,
                id: Not(user.id)
            };
        }

        const userFound = await service.findOne({ where: whereConditions });

        if (userFound) {
            throw new AppError("Esse usuário já está sendo utilizado!");
        }
    }

    protected async verifyUserTypeExists(idUserType: string) {
        const userTypeService = new UserTypeService();

        const userTypeFound = await userTypeService.findOne({ where: { id: idUserType } });

        if (!userTypeFound) {
            throw new AppError("Tipo de usuário não encontrado");
        }

        return userTypeFound;
    }

    public async validateChangeUserType(idUserType: string) {
        const userType = await this.verifyUserTypeExists(idUserType);

        if (userType.description == "ADM" || userType.description == "E-commerce") {
            throw new AppError("Você só pode alterar entre comprador ou recebedor", 403);
        }
    }
}
