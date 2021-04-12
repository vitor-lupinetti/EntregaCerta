import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { CustomerService } from "../services/CustomerService";
import UserService from "../services/UserService";

export class CustomerController {
    async create(request: Request, response: Response) {
        // Campos CustomerEntity
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name } = request.body;
        const photo = request?.file;
        // Campos AddressEntity
        const { cep, street } = request.body;
        // Campos NeighborhoodEntity
        const { neighborhood } = request.body;
        // Campos UserEntity
        const { password, user } = request.body;

        try {
            const customerService = new CustomerService();

            const customerCreated = await customerService.createCustomerWithRelations({
                complement,
                contactNumber, email, hasWhatsApp, homeNumber, name, photo, cep,
                neighborhood, password, street, user
            });

            fs.unlink(path.resolve(__dirname, "..", "..", "uploads", photo.filename), () => { /* Faz nada quando der erro */ });

            return response.status(201).json(customerCreated);
        } catch (err) {
            const userService = new UserService();
            const userCreated = await userService.findOne({ where: { user } });

            if (userCreated) {
                userService.delete(userCreated.id || "");
            }

            if (photo) {
                fs.unlink(path.resolve(__dirname, "..", "..", "uploads", photo.filename), () => { /* Faz nada quando der erro */ });
            }

            return response.status(400).json({ error: err.errors || err.message });
        }
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
        const photo = request?.file;
        // Campos AddressEntity
        const { cep, street } = request.body;
        // Campos NeighborhoodEntity
        const { neighborhood } = request.body;

        const customerService = new CustomerService();

        const customerUpdated = await customerService.updateCustomer({ id, cep, complement, contactNumber, email, hasWhatsApp, homeNumber, name, neighborhood, photo, street });

        return response.status(201).json(customerUpdated);
    }

    async changeUserTypeOfCustomer(request: Request, response: Response) {
        const { user, userTypeId } = request.body;

        const userService = new UserService();

        const userUpdated = await userService.changeUserType(user, userTypeId);

        return response.status(200).json(userUpdated);
    }
}
