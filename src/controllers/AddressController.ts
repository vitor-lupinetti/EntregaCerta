import { Request, Response } from "express";

import { AddressService } from "../services/AddressService";

export class AddressController {
    async list(request: Request, response: Response) {
        const addressService = new AddressService();

        let addresses = await addressService.list({ relations: ["neighborhoodEntity"] });

        return response.status(200).json(addresses);
    };
}
