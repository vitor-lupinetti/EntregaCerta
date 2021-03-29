
import { NeighborhoodModel } from "./neighborhoodModel";


export interface AddressModel extends NeighborhoodModel{
    cep:string;
    id:string;
    idNeighborhood:string;
    street:string;
    neighborhoodEntity:NeighborhoodModel
}