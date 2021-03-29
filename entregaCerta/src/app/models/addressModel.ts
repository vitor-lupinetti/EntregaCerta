import { NeighborhoodModel } from "./neighborhoodModel";


export interface AddressModel{
    cep:string;
    id:string;
    idNeighborhood:string;
    street:string;
    neighborhoodEntity:NeighborhoodModel
}