import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getRepository } from "typeorm";

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
        const userTypeRepository = getRepository(UserTypeEntity);
        const userTypeService = new UserTypeService(userTypeRepository);

        const neighborhoodRepository = getRepository(NeighborhoodEntity);
        const neighborhoodService = new NeighborhoodService(neighborhoodRepository);

        const addressRepository = getRepository(AddressEntity);
        const addressService = new AddressService(addressRepository);

        const userRepository = getRepository(UserEntity);
        const userService = new UserService(userRepository);

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

        const userType: UserTypeEntity = await userTypeService.findOne({ where: { description: "Buyer" } });

        try {
            const customerToCreate: CustomerEntity = { complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo };
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

            const customerCreated = await userService.createCustomer(customerToCreate);

            // const userCreated = await userService.create(customerToCreate.userEntity);

            // customerToCreate.id = userCreated.id;
            // customerToCreate.userEntity = userCreated;

            // const customerCreated = await customerService.create(customerToCreate);

            return response.status(201).json(customerCreated);
        } catch (err) {
            /**
             * Apaga imagem quando não cadastrar
             * Faz nada caso de erro (callback vazio)
             */
            fs.unlink(path.resolve(__dirname, "..", "..", "uploads", photo), () => { });

            return response.status(400).json({ error: err.message });
        }
    }
}
