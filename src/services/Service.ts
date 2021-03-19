import { FindOneOptions, Repository } from "typeorm"

export class GenericService<T> {
    private repository: Repository<T>;

    constructor(repo: Repository<T>) {
        this.repository = repo;
    }

    public async list(options?: FindOneOptions<T>): Promise<T[]> {
        return await this.repository.find(options);
    }

    public async create(entity: T): Promise<T> {
        const entityCreated = this.repository.create(entity);

        await this.repository.save(entityCreated);

        return entityCreated;
    }
}