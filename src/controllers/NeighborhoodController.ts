import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { NeighborhoodService } from "../services/NeighborhoodService";

export class NeighborhoodController{
    async create(request: Request, response: Response){
        const { name } = request.body;

        const neighborhoodRepository = getRepository(NeighborhoodEntity);
        const neighborhoodService = new NeighborhoodService(neighborhoodRepository);

        try {
            const neighborhoodToCreate: NeighborhoodEntity = {  name };
            const neighborhoodCreated = await neighborhoodService.create(neighborhoodToCreate);
            return response.status(201).json(neighborhoodCreated);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }

    }

}