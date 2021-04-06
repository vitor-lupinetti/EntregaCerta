import * as yup from "yup";

import { UserEntity } from "../../entities/UserEntity"
import { AppError } from "../../errors/AppError";
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
            user: yup.string().trim().max(20, "Usuário com mais de 20 caracteres").required("Usuário inválido"),
            idUserType: yup.string().trim().required("Tipo do usuário inválido"),
            password: yup.string().trim().min(5, "Senha com menos de 5 caracteres").max(20, "Senha com mais de 20 caracteres"),
        })

        await schema.validate(user, this.validateOptions)

        await this.verifyUserTypeExists(user.idUserType);
    }

    protected async verifyUserExists(service: UserService, username: string): Promise<void> {
        const userFind = await service.findOne({ where: { user: username } });

        if (userFind) {
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

    public async validateChangeUserType(idUserType: string){
        const userType = await this.verifyUserTypeExists(idUserType);
        if(userType.description == "ADM" || userType.description == "E-commerce"){
            throw new AppError("Você só pode alterar entre comprador ou recebedor", 403);
        }
    }
}
