import fs from "fs";
import path from "path";
import { FindOneOptions, getCustomRepository } from "typeorm";

import { CustomerEntity } from "../entities/CustomerEntity";
import { UserTypeEntity } from "../entities/UserTypeEntity";
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

export class CustomerService extends GenericService<CustomerEntity>{
    constructor() {
        super(getCustomRepository(CustomerRepository), new CustomerValidation());
    }

    public async createCustomerWithRelations(model: CustomerRelationsDTO) {
        const userTypeService = new UserTypeService();

        const neighborhoodService = new NeighborhoodService();

        const addressService = new AddressService();

        const userService = new UserService();

        const userType: UserTypeEntity = await userTypeService.findOne({ where: { description: "Buyer" } });

        // Campos CustomerEntity
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo } = model;
        // Campos AddressEntity
        const { cep, street } = model;
        // Campos NeighborhoodEntity
        const { neighborhood } = model;
        // Campos UserEntity
        const { password, user } = model;
        const photoData = fs.readFileSync(photo.path);
        const photoEncoded = photoData.toString('base64');

        const customerToCreate: CustomerEntity = { complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo: photoEncoded, photoMimeType: photo.mimetype };
        customerToCreate.addressEntity = { cep, street };
        customerToCreate.addressEntity.neighborhoodEntity = { name: neighborhood };
        customerToCreate.userEntity = { idUserType: userType.id || "", password, user };

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

        let customerFound = await this.findOne({ where: { id }, relations: ["userEntity", "addressEntity", "userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"] });
        let photoEncoded;
        if (photo) {
            fs.unlink(path.resolve(__dirname, "..", "..", "uploads", customerFound.photo || ""), () => { });
            const photoData = fs.readFileSync(photo.path);
            photoEncoded = photoData.toString('base64');
        } else {
            photoEncoded = customerFound.photo;
        }

        customerFound = { ...customerFound, complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo: photoEncoded };
        customerFound.addressEntity = { cep, street };
        customerFound.addressEntity.neighborhoodEntity = { name: neighborhood };

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

        await (this.validation as CustomerValidation).validateOnUpdate(this, customerFound);

        delete customerFound.photo_url;

        // await this.repository.update(id, customerFound);
        await this.repository.save(customerFound);

        customerFound.photo_url = `${process.env.APP_URL}:${process.env.PORT}/uploads/${photo}`;

        return customerFound;
    }
}
