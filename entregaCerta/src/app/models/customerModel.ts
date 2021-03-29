import { NeighborhoodModel } from 'src/app/models/neighborhoodModel';
import { AddressModel } from './addressModel';
import { UserModel } from './userModel';
import { UserTypeModel } from './userTypeModel';


export interface CustomerModel extends UserModel, AddressModel{
    id: string;
    idAddress: string;
    complement:string;
    contactNumber:string;
    email:string;
    hasWhatsApp:string;
    homeNumber:string;
    name:string;
    photo:string;
    photo_url:string;
    token:string;
    userEntity: UserModel;
    addressEntity:AddressModel;
}