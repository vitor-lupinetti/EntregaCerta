import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getConnection } from "typeorm";

import { CustomerService } from "../services/CustomerService";


export class CustomerController {
    async create(request: Request, response: Response) {
        // Campos CustomerEntity
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name } = request.body;
        const photo = request?.file?.filename || "";
        // Campos AddressEntity
        const { cep, street } = request.body;
        // Campos NeighborhoodEntity
        const { neighborhood } = request.body;
        // Campos UserEntity
        const { password, user } = request.body;

        const connection = getConnection();

        const queryRunner = connection.createQueryRunner();

        try {
            const customerService = new CustomerService();

            await queryRunner.connect();
            await queryRunner.startTransaction();

            const customerCreated = await customerService.createCustomerWithRelations({
                complement,
                contactNumber, email, hasWhatsApp, homeNumber, name, photo, cep,
                neighborhood, password, street, user
            });

            await queryRunner.commitTransaction();

            return response.status(201).json(customerCreated);
        } catch (err) {
            /**
             * Apaga imagem quando não cadastrar
             * Faz nada caso de erro (callback vazio)
             */
            fs.unlink(path.resolve(__dirname, "..", "..", "uploads", photo), () => { });
            await queryRunner.rollbackTransaction();
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
        const photo = request?.file?.filename;
        // Campos AddressEntity
        const { cep, street } = request.body;
        // Campos NeighborhoodEntity
        const { neighborhood } = request.body;

        const customerService = new CustomerService();

        const customerUpdated = await customerService.updateCustomer({ id, cep, complement, contactNumber, email, hasWhatsApp, homeNumber, name, neighborhood, photo, street });

        return response.status(201).json(customerUpdated);
    }
}
