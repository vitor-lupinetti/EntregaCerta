import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { CustomerEntity } from "../entities/CustomerEntity";
import { CustomerService } from "../services/CustomerService";


export class CustomerController{

    async create(request: Request, response: Response){
        const { idAddress, complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo } = request.body;

        const customerRepository = getRepository(CustomerEntity);
        const customerService = new CustomerService(customerRepository);

        try {
            const customerToCreate: CustomerEntity = { idAddress, complement, contactNumber, email, hasWhatsApp, homeNumber, name, photo };
            const customerCreated = await customerService.create(customerToCreate);
            return response.status(201).json(customerCreated);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }

    }
}