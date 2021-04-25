import { ValidateOptions } from "yup/lib/types";

import { Entity } from "../../entities/Entity";
import { AppError } from "../../errors/AppError";
import { GenericService } from "../Service";

export abstract class Validation<T extends Entity> {
    protected alreadyValidate: boolean = false;
    protected canThrowErrors: boolean = true;
    protected errors: string[] = [];
    protected validateOptions: ValidateOptions = {
        abortEarly: false
    };

    public ableThrowErrors(): void {
        this.canThrowErrors = true;
    }

    public disableThrowErrors(): void {
        this.canThrowErrors = false;
    }

    public getErrors(): string[] {
        return this.errors;
    }

    public addErrors(errors: string[]) {
        errors.forEach((error: string) => {
            this.errors.push(error);
        });
    }

    public async validateCreate(service: GenericService<T>, entity: T): Promise<void> {
        if (this.alreadyValidate) {
            return;
        }

        this.alreadyValidate = true;

        await this.validateFields(entity, true);
        await this.verifyIfExists(service, entity, true);

        this.throwErrors();
    }

    public async validateUpdate(service: GenericService<T>, entity: T): Promise<void> {
        let entityFound = await service.findOne({ where: { id: entity.id } });

        if (!entityFound) {
            throw new AppError("Não encontrado para atualizar", 404);
        }

        if (this.alreadyValidate) {
            return;
        }

        this.alreadyValidate = true;

        await this.validateFields(entity, false);
        await this.verifyIfExists(service, entity, false);

        this.throwErrors();
    }

    public async validateDelete(service: GenericService<T>, id: string): Promise<void> {
        this.errors.push("\"validateDelete\" not implemented");

        this.throwErrors();
    }

    protected throwErrors() {
        if (this.canThrowErrors && this.errors.length > 0) {
            throw new AppError(this.errors);
        }
    }

    protected async validateFields(entity: T, isCreate: boolean): Promise<void> {
        this.errors.push("\"validateFields\" not implemented");
    }

    protected async verifyIfExists(service: GenericService<T>, entity: T, isCreate: boolean): Promise<void> {
        this.errors.push("\"verifyIfExists\" not implemented");
    }
}
