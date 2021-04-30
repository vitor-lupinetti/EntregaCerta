import { FindOneOptions, getCustomRepository, getManager } from "typeorm";

import { CustomerEntity } from "../entities/CustomerEntity";
import { AppError } from "../errors/AppError";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AddressService } from "./AddressService";
import { NeighborhoodService } from "./NeighborhoodService";
import { GenericService } from "./Service";
import UserService from "./UserService";
import UserTypeService from "./UserTypeService";
import { CustomerValidation } from "./validations/CustomerValidation";

interface GetReceivingPointsDTO {
    cep?: string,
    complement?: string,
    neighborhood?: string,
    name?: string
}

export class CustomerService extends GenericService<CustomerEntity>{
    constructor() {
        super(getCustomRepository(CustomerRepository), new CustomerValidation());
    }

    public async create(customer: CustomerEntity) {
        const addressService = new AddressService();
        const neighborhoodService = new NeighborhoodService();
        const userService = new UserService();
        const userTypeService = new UserTypeService();

        if (customer.userEntity) {
            const userType = await userTypeService.findOne({ where: { description: "Buyer" } });

            customer.userEntity.idUserType = userType.id || "";
        }

        await this.treatValidations(customer, true, neighborhoodService, addressService, userService);

        if (customer.addressEntity) {
            if (customer.addressEntity.neighborhoodEntity) {
                const neighborhoodCreated = await neighborhoodService.create(customer.addressEntity.neighborhoodEntity);

                if (neighborhoodCreated) {
                    customer.addressEntity.idNeighborhood = neighborhoodCreated.id;
                    customer.addressEntity.neighborhoodEntity = neighborhoodCreated;
                }
            }

            const addressCreated = await addressService.create(customer.addressEntity);

            if (addressCreated) {
                customer.idAddress = addressCreated.id;
                customer.addressEntity = addressCreated;
            }
        }

        if (customer.userEntity) {
            const userCreated = await userService.create(customer.userEntity);

            customer.id = userCreated.id;
            customer.userEntity = userCreated;
        }

        return await super.create(customer);
    }

    public async list(options?: FindOneOptions<CustomerEntity>): Promise<CustomerEntity[]> {
        const customers = await super.list(options);

        customers.forEach(customer => {
            delete customer.photo;
        });

        return customers;
    }

    public async update(customer: CustomerEntity): Promise<CustomerEntity> {
        const addressService = new AddressService();
        const neighborhoodService = new NeighborhoodService();

        await this.treatValidations(customer, false, neighborhoodService, addressService);

        if (customer.addressEntity) {
            if (customer.addressEntity.neighborhoodEntity) {
                const neighborhoodCreated = await neighborhoodService.create(customer.addressEntity.neighborhoodEntity);

                if (neighborhoodCreated) {
                    customer.addressEntity.idNeighborhood = neighborhoodCreated.id;
                    customer.addressEntity.neighborhoodEntity = neighborhoodCreated;
                }
            }

            const addressCreated = await addressService.create(customer.addressEntity);

            if (addressCreated) {
                customer.idAddress = addressCreated.id;
                customer.addressEntity = addressCreated;
            }
        }

        if (!customer.photo) {
            let customerFound = await this.findOne({ where: { id: customer.id } });

            customer.photo = customerFound.photo;
            customer.photoMimeType = customerFound.photoMimeType;
        }

        return await super.update(customer);
    }

    public async getReceivingPoints(model: GetReceivingPointsDTO) {
        const filter = await this.buildFilter(model);

        const points = await getManager()
            .createQueryBuilder(CustomerEntity, 'c')
            .addSelect('c.id', 'c_id')
            .innerJoinAndSelect('c.userEntity', 'u', 'c.id = u.id')
            .innerJoinAndSelect('u.userTypeEntity', 'ut', 'u.idUserType = ut.id')
            .innerJoinAndSelect('c.addressEntity', 'a', 'c.idAddress = a.id')
            .innerJoinAndSelect('a.neighborhoodEntity', 'n', 'a.idNeighborhood = n.id')
            .where(filter)
            .getMany();

        return points;
    }

    private async buildFilter(model: GetReceivingPointsDTO) {
        let filters = [];

        filters.push(`ut.description = 'Receiver'`)

        if (model.neighborhood) {
            filters.push(`n.name = '${model.neighborhood}'`);
        }

        if (model.cep) {
            filters.push(`a.cep = '${model.cep}'`);
        }

        if (model.name) {
            filters.push(`c.name = '${model.name}'`);
        }

        if (model.complement) {
            filters.push(`c.complement = '${model.complement}'`);
        }

        return filters.join(" and ");
    }

    public async onlyValidateCreate(customer: CustomerEntity): Promise<string[]> {
        this.validation.disableThrowErrors();
        await this.validation.validateCreate(this, customer);

        return this.validation.getErrors();
    }

    public async onlyValidateUpdate(customer: CustomerEntity): Promise<string[]> {
        this.validation.disableThrowErrors();
        await this.validation.validateUpdate(this, customer);

        return this.validation.getErrors();
    }

    public async delete(id: string): Promise<void> {
        this.validation.ableThrowErrors();

        await this.validation.validateDelete(this, id);

        await super.delete(id);

        const userRepository = getCustomRepository(UserRepository);

        await userRepository.delete(id);
    }

    private async treatValidations(
        customer: CustomerEntity,
        isCreate: boolean,
        neighborhoodService: NeighborhoodService,
        addressService: AddressService,
        userService?: UserService
    ) {
        if (customer.addressEntity) {
            let addressEntity = customer.addressEntity;

            if (addressEntity.neighborhoodEntity) {
                let neighborhoodEntity = addressEntity.neighborhoodEntity;

                this.validation.addErrors(await neighborhoodService.onlyValidateCreate(neighborhoodEntity));

                addressEntity.idNeighborhood = neighborhoodEntity.id;
            }

            this.validation.addErrors(await addressService.onlyValidateCreate(addressEntity));

            customer.idAddress = addressEntity.id;
        }

        let customerErrors = [];

        if (isCreate) {
            if (customer.userEntity && userService) {
                let userEntity = customer.userEntity;

                this.validation.addErrors(await userService.onlyValidateCreate(userEntity));
            }

            customerErrors = await this.onlyValidateCreate(customer);
        } else {
            customerErrors = await this.onlyValidateUpdate(customer);
        }

        if (customerErrors.length > 0) {
            throw new AppError(customerErrors);
        }
    }
}
