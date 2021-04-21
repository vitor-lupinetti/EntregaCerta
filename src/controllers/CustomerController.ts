import { Request, Response } from "express";
import { CustomerEntity } from "../entities/CustomerEntity";

import { CustomerService } from "../services/CustomerService";
import { FileService } from "../services/FileService";
import UserService from "../services/UserService";

export class CustomerController {
    async create(request: Request, response: Response) {
        // Campos CustomerEntity
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name } = request.body;
        // Campos AddressEntity
        const { cep, street } = request.body;
        // Campos NeighborhoodEntity
        const { neighborhood } = request.body;
        // Campos UserEntity
        const { password, user } = request.body;

        let photo = "";
        let photoMimeType = "";

        if (request.file) {
            const fileService = new FileService();

            const convertedFile = fileService.convertToBase64(request.file);

            photo = convertedFile.fileEncoded;
            photoMimeType = convertedFile.mimeType;
        }

        const customerToCreate: CustomerEntity = { complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo, photoMimeType };
        customerToCreate.addressEntity = { cep, street };
        customerToCreate.addressEntity.neighborhoodEntity = { name: neighborhood };
        customerToCreate.userEntity = { idUserType: "", password, user };

        const customerService = new CustomerService();

        const customerCreated = await customerService.create(customerToCreate);

        return response.status(201).json(customerCreated);
    }

    async list(request: Request, response: Response) {
        const customerService = new CustomerService();

        const customers = await customerService.list({ relations: ["userEntity", "addressEntity", "userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"] });

        return response.json(customers);
    }

    async findCustomerById(request: Request, response: Response) {
        const { id } = request.params;

        const customerService = new CustomerService();
        const customer = await customerService.findOne({ where: { id: id }, relations: ["userEntity", "addressEntity", "userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"] });

        if (customer) {
            return response.json(customer);
        }

        return response.status(404).json({ message: "Usuário não encontrado" })
    }

    async update(request: Request, response: Response) {
        // Campos CustomerEntity
        const { id, complement, contactNumber, email, hasWhatsApp, homeNumber, name } = request.body;
        // Campos AddressEntity
        const { cep, street } = request.body;
        // Campos NeighborhoodEntity
        const { neighborhood } = request.body;

        let photo = "";
        let photoMimeType = "";

        if (request.file) {
            const fileService = new FileService();

            const convertedFile = fileService.convertToBase64(request.file);

            photo = convertedFile.fileEncoded;
            photoMimeType = convertedFile.mimeType;
        }

        const customerToUpdate: CustomerEntity = { id, complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo, photoMimeType };
        customerToUpdate.addressEntity = { cep, street };
        customerToUpdate.addressEntity.neighborhoodEntity = { name: neighborhood };

        const customerService = new CustomerService();

        const customerUpdated = await customerService.update(customerToUpdate);

        return response.status(201).json(customerUpdated);
    }

    async changeUserTypeOfCustomer(request: Request, response: Response) {
        const { user, idUserType } = request.body;

        const userService = new UserService();
        const userUpdated = await userService.changeUserType(user, idUserType);

        return response.status(200).json(userUpdated);
    }

    async getReceivingPoints(request: Request, response: Response) {
        const { cep, neighborhood, complement, idReceiver } = request.body;

        const customerService = new CustomerService();
        const points = await customerService.getReceivingPoints({ cep, neighborhood, complement, idReceiver });

        return response.status(200).json(points);
    }
}
