import { ValidateOptions } from "yup/lib/types";

import { Entity } from "../../entities/Entity";
import { AppError } from "../../errors/AppError";
import { GenericService } from "../Service";

export abstract class Validation<T extends Entity> {
    protected alreadyValidateSimpleFields: boolean = false;
    protected errors: string[] = [];
    protected validateOptions: ValidateOptions = {
        abortEarly: false
    };

    public getErrors(): string[] {
        return this.errors;
    }

    public async validateCreate(service: GenericService<T>, entity: T): Promise<void> {
        if (!this.alreadyValidateSimpleFields) {
            await this.validateSimpleFields(entity, true);
        }

        await this.validateKeyFields(entity, true);
        await this.verifyIfExists(service, entity, true);

        this.throwErrors();
    }

    public async validateUpdate(service: GenericService<T>, entity: T): Promise<void> {
        if (!this.alreadyValidateSimpleFields) {
            await this.validateSimpleFields(entity, false);
        }

        await this.validateKeyFields(entity, false);
        await this.verifyIfExists(service, entity, false);

        this.throwErrors();
    }

    public async validateDelete(service: GenericService<T>, entity: T): Promise<void> {
        this.errors.push("\"validateDelete\" not implemented");

        this.throwErrors();
    }

    public addErrors(errors: string[]) {
        errors.forEach((error: string) => {
            this.errors.push(error);
        });
    }

    protected throwErrors() {
        if (this.errors.length > 0) {
            throw new AppError(this.errors);
        }
    }

    protected async validateKeyFields(entity: T, isCreate: boolean): Promise<void> {
        this.errors.push("\"validateKeyFields\" not implemented");
    }

    public async validateSimpleFields(entity: T, isCreate: boolean): Promise<void> {
        this.errors.push("\"validateSimpleFields\" not implemented");
    }

    protected async verifyIfExists(service: GenericService<T>, entity: T, isCreate: boolean): Promise<void> {
        this.errors.push("\"verifyIfExists\" not implemented");
    }
}
