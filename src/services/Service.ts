import { FindConditions, FindOneOptions, Repository } from "typeorm";

import { Validation } from "./validations/Validation";

export class GenericService<T> {
    protected repository: Repository<T>;
    protected validation: Validation<T>;

    constructor(repo: Repository<T>, validation: Validation<T>) {
        this.repository = repo;
        this.validation = validation;
    }

    public async list(options?: FindOneOptions<T>): Promise<T[]> {
        return await this.repository.find(options);
    }

    public async create(entity: T): Promise<T> {
        this.validation.ableThrowErrors();
        await this.validation.validateCreate(this, entity);

        return await this.repository.save(entity);
    }

    public async findOne(options?: FindOneOptions<T>): Promise<T> {
        return (await this.repository.find(options))[0];
    }

    public async update(entity: T): Promise<T> {
        this.validation.ableThrowErrors();
        await this.validation.validateUpdate(this, entity);

        return await this.repository.save(entity);
    }

    public async delete(criteria: string | FindConditions<T>): Promise<void> {
        await this.repository.delete(criteria);
    }
}
