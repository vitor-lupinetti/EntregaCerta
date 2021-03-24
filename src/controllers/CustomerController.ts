import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { getConnection, getRepository } from "typeorm";

import { CustomerEntity } from "../entities/CustomerEntity";
import { CustomerService } from "../services/CustomerService";


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
            console.log(err.message)

            return response.status(400).json({ error: err.message });
        }
    }

    async list(request: Request, response:Response){
        const customerRepository = getRepository(CustomerEntity);
        const customerService = new CustomerService(customerRepository);

        const customers = await customerService.list({relations: ["userEntity", "addressEntity","userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"]});

        return response.json(customers);
    }

    async findCustomerById(request:Request, response:Response){
        const {id} = request.params;

        console.log(id);
        const customerService = new CustomerService(getRepository(CustomerEntity));
        const customer = await customerService.findOne({where:{id:id}, relations:["userEntity", "addressEntity","userEntity.userTypeEntity", "addressEntity.neighborhoodEntity"]});

        if(customer){
            return response.json(customer);
        }
        return response.status(404).json({message: "Usuário não encontrado"})
    }
}
