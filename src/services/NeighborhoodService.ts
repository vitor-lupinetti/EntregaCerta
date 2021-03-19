import { Repository } from "typeorm";
import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";
import { GenericService } from "./Service";


export class NeighborhoodService extends GenericService<NeighborhoodEntity>{
    constructor(repo: Repository<NeighborhoodEntity>) {
        super(repo);
    }
}