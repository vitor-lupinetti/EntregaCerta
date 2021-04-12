import { ValidateOptions } from "yup/lib/types";

import { Entity } from "../../entities/Entity";
import { AppError } from "../../errors/AppError";
import { GenericService } from "../Service";

export abstract class Validation<T extends Entity> {
    protected validateOptions: ValidateOptions = {
        abortEarly: false
    };

    public async validateCreate(service: GenericService<T>, entity: T): Promise<void> {
        await this.validateFields(entity, true);
        await this.verifyIfExists(service, entity, true);
    }

    public async validateUpdate(service: GenericService<T>, entity: T): Promise<void> {
        let entityFound = service.findOne({ where: { id: entity.id } });

        if (!entityFound) {
            throw new AppError("Não encontrado");
        }

        await this.validateFields(entity, false);
        await this.verifyIfExists(service, entity, false);
    }

    public async validateDelete(service: GenericService<T>, entity: T): Promise<void> {
        throw new AppError("Not implemented");
    }

    protected async validateFields(entity: T, isCreate: boolean): Promise<void> {
        throw new AppError("Not implemented");
    }

    protected async verifyIfExists(service: GenericService<T>, entity: T, isCreate: boolean): Promise<void> {
        throw new AppError("Not implemented");
    }
}
