import { FindConditions, Not } from "typeorm";
import * as yup from "yup"

import { UserTypeEntity } from "../../entities/UserTypeEntity"
import { AppError } from "../../errors/AppError";
import UserTypeService from "../UserTypeService";
import { Validation } from "./Validation";

export class UserTypeValidation extends Validation<UserTypeEntity> {
    protected async validateFields(userType: UserTypeEntity, isCreate: boolean): Promise<void> {
        const schema = yup.object().shape({
            description: yup.string().max(20, "Descrição com mais de 20 caracteres").required("Descrição obrigatória")
        });

        await schema.validate(userType, this.validateOptions);
    }

    protected async verifyIfExists(service: UserTypeService, userType: UserTypeEntity, isCreate: boolean): Promise<void> {
        let whereConditions: FindConditions<UserTypeEntity> = {
            description: userType.description
        };

        if (!isCreate) {
            whereConditions = {
                ...whereConditions,
                id: Not(userType.id)
            }
        }

        const userTypeFind = await service.findOne({ where: whereConditions });

        if (userTypeFind) {
            throw new AppError("Tipo de usuário já existente");
        }
    }
}
