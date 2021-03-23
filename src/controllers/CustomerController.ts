import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getConnection, getRepository } from "typeorm";

import { AddressEntity } from "../entities/AddressEntity";
import { CustomerEntity } from "../entities/CustomerEntity";
import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { UserEntity } from "../entities/UserEntity";
import { UserTypeEntity } from "../entities/UserTypeEntity";
import { AddressService } from "../services/AddressService";
import { CustomerService } from "../services/CustomerService";
import { NeighborhoodService } from "../services/NeighborhoodService";
import UserService from "../services/UserService";
import UserTypeService from "../services/UserTypeService";

export class CustomerController {
    async create(request: Request, response: Response) {
       
        const customerRepository = getRepository(CustomerEntity);
        const customerService = new CustomerService(customerRepository);

        // Campos CustomerEntity
        const { complement, contactNumber, email, hasWhatsApp, homeNumber, name } = request.body;
        const photo = request.file.filename;
        // Campos AddressEntity
        const { cep, street } = request.body;
        // Campos NeighborhoodEntity
        const { neighborhood } = request.body;
        // Campos UserEntity
        const { password, user } = request.body;


        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
           
            const customerCreated = await customerService.createCustomerWithRelations({complement, 
                contactNumber, email, hasWhatsApp, homeNumber, name, photo, cep,
                neighborhood,password,street,user});

            await queryRunner.commitTransaction();
            return response.status(201).json(customerCreated);
        } catch (err) {
            /**
             * Apaga imagem quando não cadastrar
             * Faz nada caso de erro (callback vazio)
             */
            fs.unlink(path.resolve(__dirname, "..", "..", "uploads", photo), () => { });
            await queryRunner.rollbackTransaction();
            return response.status(400).json({ error: err.message });
        }
    }

    async list(request: Request, response:Response){
        const customerRepository = getRepository(CustomerEntity);
        const customerService = new CustomerService(customerRepository);

        const customers = await customerService.list({relations: ["userEntity", "addressEntity","userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"]});

        return response.json(customers);
    }
}
