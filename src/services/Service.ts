import { FindOneOptions, Repository } from "typeorm";

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
        await this.validation.validate(this, entity);
        const entityCreated = this.repository.create(entity);

        await this.repository.save(entityCreated);

        return entityCreated;
    }

    public async findOne(options?: FindOneOptions<T>): Promise<T> {
        return (await this.repository.find(options))[0];
    }
}
