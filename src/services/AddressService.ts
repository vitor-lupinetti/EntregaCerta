import { Repository } from "typeorm";
import { AddressEntity } from "../entities/AddressEntity";
import { GenericService } from "./Service";


export class AddressService extends GenericService<AddressEntity>{
    constructor(repo: Repository<AddressEntity>) {
        super(repo);
    }

}