import { Request, Response } from "express";

import { AddressEntity } from "../entities/AddressEntity";
import { CustomerEntity } from "../entities/CustomerEntity";
import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { UserEntity } from "../entities/UserEntity";
import { CustomerService } from "../services/CustomerService";
import { FileService } from "../services/FileService";
import UserService from "../services/UserService";

export class CustomerController {
    private fillCustomerEntity(request: Request, isCreate: boolean): CustomerEntity {
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name } = request.body;
        const { cep, street } = request.body;
        const { neighborhood } = request.body;

        let photo = "";
        let photoMimeType = "";

        if (request.file) {
            const fileService = new FileService();

            const convertedFile = fileService.convertToBase64(request.file);

            photo = convertedFile.fileEncoded;
            photoMimeType = convertedFile.mimeType;
        }

        const customer = new CustomerEntity();
        customer.complement = complement;
        customer.contactNumber = contactNumber;
        customer.email = email;
        customer.hasWhatsApp = hasWhatsApp;
        customer.homeNumber = homeNumber;
        customer.name = name;
        customer.photo = photo;
        customer.photoMimeType = photoMimeType;

        customer.addressEntity = new AddressEntity();
        customer.addressEntity.cep = cep;
        customer.addressEntity.street = street;

        customer.addressEntity.neighborhoodEntity = new NeighborhoodEntity();
        customer.addressEntity.neighborhoodEntity.name = neighborhood;

        if (isCreate) {
            const { password, user } = request.body;

            customer.userEntity = new UserEntity();
            customer.userEntity.password = password;
            customer.userEntity.user = user;
        } else {
            const { id } = request.body;

            customer.id = id;
        }

        return customer;
    }

    public async create(request: Request, response: Response) {
        const customerToCreate = this.fillCustomerEntity(request, true);

        const customerService = new CustomerService();

        const customerCreated = await customerService.create(customerToCreate);

        return response.status(201).json(customerCreated);
    }

    public async list(request: Request, response: Response) {
        const customerService = new CustomerService();

        const customers = await customerService.list({ relations: ["userEntity", "addressEntity", "userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"] });

        return response.json(customers);
    }

    public async findCustomerById(request: Request, response: Response) {
        const { id } = request.params;

        const customerService = new CustomerService();
        const customer = await customerService.findOne({ where: { id: id }, relations: ["userEntity", "addressEntity", "userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"] });

        if (customer) {
            return response.json(customer);
        }

        return response.status(404).json({ message: "Usuário não encontrado" })
    }

    public async update(request: Request, response: Response) {
        const customerToUpdate = this.fillCustomerEntity(request, false);

        const customerService = new CustomerService();

        const customerUpdated = await customerService.update(customerToUpdate);

        return response.status(200).json(customerUpdated);
    }

    public async changeUserTypeOfCustomer(request: Request, response: Response) {
        const { user, idUserType } = request.body;

        const userService = new UserService();
        const userUpdated = await userService.changeUserType(user, idUserType);

        return response.status(200).json(userUpdated);
    }

    public async getReceivingPoints(request: Request, response: Response) {
        const { cep, neighborhood, complement, idReceiver } = request.body;

        const customerService = new CustomerService();
        const points = await customerService.getReceivingPoints({ cep, neighborhood, complement, idReceiver });

        return response.status(200).json(points);
    }
}
