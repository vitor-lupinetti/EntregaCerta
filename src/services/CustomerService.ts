import fs from "fs";
import path from "path";
import { createQueryBuilder, FindConditions, FindOneOptions, getConnection, getCustomRepository, getManager, getRepository } from "typeorm";
import { AddressEntity } from "../entities/AddressEntity";

import { CustomerEntity } from "../entities/CustomerEntity";
import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { UserTypeEntity } from "../entities/UserTypeEntity";
import { AppError } from "../errors/AppError";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { AddressService } from "./AddressService";
import { NeighborhoodService } from "./NeighborhoodService";
import { GenericService } from "./Service";
import UserService from "./UserService";
import UserTypeService from "./UserTypeService";
import { CustomerValidation } from "./validations/CustomerValidation";

interface CustomerRelationsDTO {
    complement: string,
    contactNumber: string,
    email: string,
    hasWhatsApp: string,
    homeNumber: string,
    name: string,
    photo: Express.Multer.File,
    cep: string,
    street: string,
    neighborhood: string,
    password: string,
    user: string,
}

interface CustomerRelationsUpdateDTO {
    id: string,
    complement: string,
    contactNumber: string,
    email: string,
    hasWhatsApp: string,
    homeNumber: string,
    cep: string,
    street: string,
    name: string,
    neighborhood: string,
    photo: Express.Multer.File
}

interface GetReceivingPointsDTO {
    cep?: string,
    complement?: string,
    neighborhood?: string,
    idReceiver?: string
}

export class CustomerService extends GenericService<CustomerEntity>{
    constructor() {
        super(getCustomRepository(CustomerRepository), new CustomerValidation());
    }

    public async createCustomerWithRelations(model: CustomerRelationsDTO) {
        const addressService = new AddressService();
        const neighborhoodService = new NeighborhoodService();
        const userService = new UserService();
        const userTypeService = new UserTypeService();

        const userType: UserTypeEntity = await userTypeService.findOne({ where: { description: "Buyer" } });

        // Campos CustomerEntity
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo } = model;
        // Campos AddressEntity
        const { cep, street } = model;
        // Campos NeighborhoodEntity
        const { neighborhood } = model;
        // Campos UserEntity
        const { password, user } = model;

        let photoEncoded = "";
        let photoMimeType = "";

        if (photo) {
            photoMimeType = photo.mimetype;

            let photoData = fs.readFileSync(photo.path);
            photoEncoded = photoData.toString('base64');
        }

        const customerToCreate: CustomerEntity = { complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo: photoEncoded, photoMimeType };
        customerToCreate.addressEntity = { cep, street };
        customerToCreate.addressEntity.neighborhoodEntity = { name: neighborhood };
        customerToCreate.userEntity = { idUserType: userType.id || "", password, user };

        await this.treatValidations(customerToCreate, neighborhoodService, addressService, userService);

        const neighborhoodCreated = await neighborhoodService.create(customerToCreate.addressEntity.neighborhoodEntity);

        if (neighborhoodCreated) {
            customerToCreate.addressEntity.idNeighborhood = neighborhoodCreated.id;
            customerToCreate.addressEntity.neighborhoodEntity = neighborhoodCreated;
        }

        const addressCreated = await addressService.create(customerToCreate.addressEntity);

        if (addressCreated) {
            customerToCreate.idAddress = addressCreated.id;
            customerToCreate.addressEntity = addressCreated;
        }

        const userCreated = await userService.create(customerToCreate.userEntity);

        customerToCreate.id = userCreated.id;
        customerToCreate.userEntity = userCreated;

        const customerCreated = await super.create(customerToCreate);

        return customerCreated;
    }

    public async list(options?: FindOneOptions<CustomerEntity>): Promise<CustomerEntity[]> {
        const customers = await super.list(options);

        customers.forEach(customer => {
            delete customer.photo;
        });

        return customers;
    }

    public async findOne(options?: FindOneOptions<CustomerEntity>): Promise<CustomerEntity> {
        const customer = await super.findOne(options);
        if (customer) {
            customer.photo_url = `${process.env.APP_URL}:${process.env.PORT}/uploads/${customer.photo}`;
        }

        return customer;
    }

    public async updateCustomer(model: CustomerRelationsUpdateDTO): Promise<CustomerEntity> {
        const addressService = new AddressService();
        const neighborhoodService = new NeighborhoodService();

        // Campos CustomerEntity
        let { id, complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo } = model;
        // Campos AddressEntity
        const { cep, street } = model;
        // Campos NeighborhoodEntity
        const { neighborhood } = model;

        let customerFound = await this.findOne(
            {
                where: { id },
                relations: ["userEntity", "addressEntity", "userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"]
            }
        );

        if (!customerFound) {
            throw new AppError("Cliente não encontrado");
        }

        let photoEncoded = customerFound.photo;
        let photoMimeType = customerFound.photoMimeType;

        if (photo) {
            photoMimeType = photo.mimetype;

            let photoData = fs.readFileSync(photo.path);
            photoEncoded = photoData.toString('base64');

            fs.unlink(path.resolve(__dirname, "..", "..", "uploads", photo.filename), () => { /* Faz nada quando der erro */ });
        }

        customerFound = { ...customerFound, complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo: photoEncoded, photoMimeType };
        customerFound.addressEntity = { cep, street };
        customerFound.addressEntity.neighborhoodEntity = { name: neighborhood };

        await this.treatValidations(customerFound, neighborhoodService, addressService);

        const neighborhoodCreated = await neighborhoodService.create(customerFound.addressEntity.neighborhoodEntity);

        if (neighborhoodCreated) {
            customerFound.addressEntity.idNeighborhood = neighborhoodCreated.id;
            customerFound.addressEntity.neighborhoodEntity = neighborhoodCreated;
        }

        const addressCreated = await addressService.create(customerFound.addressEntity);

        if (addressCreated) {
            customerFound.idAddress = addressCreated.id;
            customerFound.addressEntity = addressCreated;
        }

        await this.validation.validateUpdate(this, customerFound);

        // await this.repository.update(id, customerFound);
        await this.repository.save(customerFound);

        return customerFound;
    }

    public async getReceivingPoints(model: GetReceivingPointsDTO) {
        const filter = await this.buildFilter(model);

        const points = await getManager()
            .createQueryBuilder(CustomerEntity, 'c')
            .addSelect('c.id', 'c_id')
            .innerJoinAndSelect('c.addressEntity', 'a', 'c.idAddress = a.id')
            .innerJoinAndSelect('a.neighborhoodEntity', 'n', 'a.idNeighborhood = n.id')
            .where(filter)
            .getMany();

        return points;
    }

    private async buildFilter(model: GetReceivingPointsDTO) {

        let filters = [];
        let filter = '';

        if (model.neighborhood) {
            filters.push(`n.name = '${model.neighborhood}'`)
        }

        if (model.cep) {
            filters.push(`a.cep = '${model.cep}'`)
        }

        if (model.idReceiver) {
            filters.push(`c.id = '${model.idReceiver}'`)
        }

        if (model.complement) {
            filters.push(`c.complement = '${model.complement}'`)
        }

        for (let i = 0; i < filters.length; i++) {
            const element = filters[i];
            filter += element;

            if (i + 1 != filters.length) {
                filter += ' and '
            }
        }

        return filter;
    }

    public async onlyValidateCreate(customer: CustomerEntity): Promise<string[]> {
        await this.validation.validateSimpleFields(customer, true);

        return this.validation.getErrors();
    }

    private async treatValidations(customer: CustomerEntity, neighborhoodService: NeighborhoodService, addressService: AddressService, userService?: UserService) {
        if (customer.userEntity && userService) {
            let userEntity = customer.userEntity;

            this.validation.addErrors(await userService.onlyValidateCreate(userEntity));
        }

        if (customer.addressEntity) {
            let addressEntity = customer.addressEntity;

            this.validation.addErrors(await addressService.onlyValidateCreate(addressEntity));

            if (addressEntity.neighborhoodEntity) {
                let neighborhoodEntity = addressEntity.neighborhoodEntity;

                this.validation.addErrors(await neighborhoodService.onlyValidateCreate(neighborhoodEntity));
            }
        }

        let customerErrors = await this.onlyValidateCreate(customer);

        if (customerErrors.length > 0) {
            throw new AppError(customerErrors);
        }
    }
}
