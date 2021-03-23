import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { AddressEntity } from "../entities/AddressEntity";
import { AddressService } from "../services/AddressService";

export class AddressController {
    async create(request: Request, response: Response) {
        const { idNeighborhood, cep, street } = request.body;

        const addressRepository = getRepository(AddressEntity);
        const addressService = new AddressService(addressRepository);

        try {
            const addressToCreate: AddressEntity = { idNeighborhood, cep, street };
            const addressCreated = await addressService.create(addressToCreate);

            return response.status(201).json(addressCreated);
        } catch (err) {
            return response.status(400).json({ error: err.errors || err.message });
        }
    }

    async list(request: Request, response: Response) {
        const addressRepository = getRepository(AddressEntity);
        const addressService = new AddressService(addressRepository);

        let addresses = await addressService.list();

        return response.status(200).json(addresses);
    };
}
