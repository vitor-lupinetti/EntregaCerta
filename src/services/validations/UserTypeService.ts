import * as yup from "yup"

import { UserTypeEntity } from "../../entities/UserTypeEntity"
import UserTypeService from "../UserTypeService";
import { Validation } from "./Validation";

export class UserTypeValidation extends Validation<UserTypeEntity> {
    protected async validateFields(userType: UserTypeEntity): Promise<void> {
        const schema = yup.object().shape({
            description: yup.string().max(20, "Descrição com mais de 20 caracteres").required("Descrição obrigatória")
        });

        await schema.validate(userType, this.validateOptions);
    }

    protected async verifyIfExists(service: UserTypeService, userType: UserTypeEntity): Promise<void> {
        const userTypeFind = await service.findOne({ where: { description: userType.description } });

        if (userTypeFind) {
            throw new Error("Tipo de usuário já existente");
        }
    }
}
