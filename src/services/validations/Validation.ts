import { ValidateOptions } from "yup/lib/types";

import { Entity } from "../../entities/Entity";
import { GenericService } from "../Service";

export abstract class Validation<T extends Entity> {
    protected validateOptions: ValidateOptions = {
        abortEarly: false
    };

    public async validate(service: GenericService<T>, entity: T): Promise<void> {
        await this.validateFields(entity);
        await this.verifyIfExists(service, entity);
    }

    protected async validateFields(entity: T): Promise<void> {
        throw new Error("Not implemented");
    }

    protected async verifyIfExists(service: GenericService<T>, entity: T): Promise<void> {
        throw new Error("Not implemented");
    }
}
