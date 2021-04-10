import { EntityRepository, Repository } from "typeorm";

import { NeighborhoodEntity } from "../entities/NeighborhoodEntity";

@EntityRepository(NeighborhoodEntity)
export class NeighborhoodRepository extends Repository<NeighborhoodEntity> { }
