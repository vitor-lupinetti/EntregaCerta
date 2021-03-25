import { Request, Response } from "express";

import { NeighborhoodService } from "../services/NeighborhoodService";

export class NeighborhoodController {
    async list(request: Request, response: Response) {
        const userService = new NeighborhoodService();

        let neighborhoods = await userService.list();

        return response.status(200).json(neighborhoods);
    };
}
